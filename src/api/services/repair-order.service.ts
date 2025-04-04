import { AppDataSource } from 'src/config/database/ormconfig'
import {
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
} from 'src/constants/status-codes'
import { Customer } from 'src/entities/Customer'
import { Device } from 'src/entities/Device'
import { PhoneBrand } from 'src/entities/PhoneBrand'
import { ProductDetail } from 'src/entities/ProductDetail'
import { RepairHistory } from 'src/entities/RepairHistory'
import { RepairOrder } from 'src/entities/RepairOrder'
import { RepairProduct } from 'src/entities/RepairProduct'
import { User } from 'src/entities/User'
import { buildWhereClause } from 'src/helpers/build-where-clause'
import {
  ConflictException,
  NotFoundException,
  UnAuthorizedException,
} from 'src/helpers/error-api'
import { paginatedQuery } from 'src/helpers/paginated-query'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
  SessionData,
} from 'src/types/api.types'
import {
  EntityManager,
  In,
  MoreThan,
  MoreThanOrEqual,
  RemoveOptions,
  SaveOptions,
} from 'typeorm'

export interface RepairOrderPayload {
  customer_id: number
  devices: {
    brand_id: number
    model: string
    imei: string
    color?: string
    physical_condition: string
    reported_issue: string
    diagnosis: string
    estimated_cost?: number
    advanced_payment?: number
    delivery_date?: Date
  }[]
}

export interface ChangeStatePayload {
  repair_order_id: number
  new_status: string
  comment?: string
  used_products?: {
    product_id: number
    quantity: number
  }[]
}

export interface UpdateOrderPayload extends RepairOrder {
  repair_order_id: number
}

export class RepairOrderService {
  private manager = AppDataSource.manager
  private brandRepository = AppDataSource.getRepository(PhoneBrand)
  private repairOrderRepository = AppDataSource.getRepository(RepairOrder)
  private userRepository = AppDataSource.getRepository(User)
  private repairHistoryRepository = AppDataSource.getRepository(RepairHistory)
  private productsRepository = AppDataSource.getRepository(RepairProduct)

  async create(
    payload: RepairOrderPayload,
    session: SessionData
  ): Promise<ApiResponse<Device>> {
    return this.manager.transaction(async (entityManager) => {
      const user = await entityManager.findOneBy(User, {
        user_id: session.userId,
      })
      if (!user) {
        throw new UnAuthorizedException('Unauthorized to create a device')
      }

      const { customer_id, devices } = payload
      const customer = await entityManager.findOneBy(Customer, { customer_id })
      if (!customer) {
        throw new NotFoundException('Customer not found')
      }

      for (const order of devices) {
        const existingDevice = await entityManager.findOneBy(Device, {
          imei: order.imei,
        })
        if (existingDevice) {
          throw new ConflictException(
            `Device with IMEI ${order.imei} already exists`
          )
        }

        const brand = await entityManager.findOneBy(PhoneBrand, {
          brand_id: order.brand_id,
        })
        if (!brand) {
          throw new NotFoundException('Phone brand not found')
        }

        const device = entityManager.create(Device, {
          brand,
          model: order.model,
          imei: order.imei,
          color: order.color,
          physical_condition: order.physical_condition,
          created_at: new Date(),
          created_by: user,
          customer,
        })
        await entityManager.save(device)

        const repair = entityManager.create(RepairOrder, {
          reported_issue: order.reported_issue,
          diagnosis: order.diagnosis,
          estimated_cost: order.estimated_cost,
          advanced_payment: order.advanced_payment,
          delivery_date: order.delivery_date,
          created_at: new Date(),
          created_by: user,
          device,
        })
        await entityManager.save(repair)

        await this.createHistory(entityManager, {
          created_by: user,
          created_at: new Date(),
          previous_status: 'P',
          new_status: 'P',
          repair,
          state: 'A',
        })
      }

      return { message: 'Device(s) created successfully' }
    })
  }

  async update(
    payload: UpdateOrderPayload,
    session: SessionData
  ): Promise<ApiResponse<RepairOrder>> {
    const { repair_order_id } = payload

    const order = await this.repairOrderRepository.findOneBy({
      repair_order_id,
    })

    if (!order) {
      throw new NotFoundException(
        `Orden de reparación con id '${repair_order_id}' not found.`
      )
    }

    const user = await this.userRepository.findOneBy({
      user_id: session.userId,
    })

    const updatedOrder = this.repairOrderRepository.merge(order, {
      ...payload,
      updated_by: user,
      updated_at: new Date(),
    })
    const data = await this.repairOrderRepository.save(updatedOrder)

    return { data, message: 'Orden actualizada con éxito' }
  }

  async getRepairOrders(
    conditions: AdvancedCondition[],
    queryParams: QueryParams
  ): Promise<ApiResponse<RepairOrder[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
      select *
        from (
            select ro.repair_order_id,
                  ro.state,
                  ro.diagnosis,
                  d.customer_id,
                  ro.delivery_date,
                  ro.status,
                  ro.estimated_cost,
                  ro.reported_issue,
                  ro.assigned_staff_id,
                  ro.advanced_payment,
                  ro.created_at,
                  ro.created_by,
                  u.name as signed_staff_name,
                  CONCAT(uc.name, ' ', uc.last_name) as created_by_name,
                  c.name as customer_name,
                  c.phone as customer_phone,
                  c.identity_document customer_identity,
                  c.email customer_email,
                  c.address customer_address,
                  d.model,
                  d.color,
                  d.imei,
                  d.physical_condition,
                  pb.name as brand,
                  concat_ws(
                      coalesce(cast(d.device_id as char), ''), ' ',
                      coalesce(pb.name, ''), ' ',
                      coalesce(cast(d.imei as char), ''), ' ',
                      coalesce(cast(d.model as char), ''), ' ',
                      coalesce(u.name, ''), ' ',
                      coalesce(u.username, ''), ' ',
                      coalesce(cast(ro.repair_order_id as char), ''), ' ',
                      coalesce(c.name, ''), ' '
                  ) collate utf8mb4_unicode_ci as filter
            from repair_order ro
            left join device d on ro.device_id = d.device_id
            left join phone_brands pb on d.brand_id = pb.brand_id
            left join user u on ro.assigned_staff_id = u.user_id
            left join customer c on d.customer_id = c.customer_id
            left join user uc on ro.created_by = uc.user_id
        ) subquery
        where ${whereClause}
        order by repair_order_id asc
    `

    const [data = [], metadata] = await paginatedQuery<RepairOrder>(
      statement,
      queryParams,
      parameters
    )

    if (!data.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    const history = await this.repairHistoryRepository.find({
      where: { state: 'A' },
      relations: ['created_by', 'repair'],
    })

    for (const order of data) {
      const orderHistory = history.filter(
        (item) => item.repair?.repair_order_id === order?.repair_order_id
      )

      order.history = orderHistory.map((item) => ({
        ...item,
        repair: null,
        username: item?.created_by?.username,
        created_by: `${item?.created_by?.name} ${item?.created_by?.last_name}`,
      })) as never
    }

    return { data, metadata }
  }

  async getProneBrands(): Promise<ApiResponse<PhoneBrand[]>> {
    const data = await this.brandRepository.find({
      where: { state: 'A' },
      order: { name: 'ASC' },
    })

    if (!data) {
      return { status: HTTP_STATUS_NOT_FOUND }
    }

    return { data }
  }

  async createHistory(
    manager: EntityManager,
    payload: Partial<RepairHistory>
  ): Promise<void> {
    try {
      const history = manager.create(RepairHistory, payload)
      await manager.save(history)
    } catch (error) {
      throw new ConflictException(
        `Error creating repair history: ${error.message}`
      )
    }
  }

  async getHistory(
    conditions: AdvancedCondition[],
    queryParams: QueryParams
  ): Promise<ApiResponse<RepairHistory[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)
    const statement = `
      SELECT 
        * 
      FROM
        (
          SELECT
            rh.history_id,
            rh.previous_status,
            rh.new_status,
            rh.repair_order_id,
            rh.state,
            rh.created_by,
            rh.created_at,
            rh.comment,
            uc.username
          FROM
            repair_history rh
            left join user uc on rh.created_by = uc.user_id
        ) subquery
      WHERE
        ${whereClause}
      ORDER BY history_id ASC
    `

    const [data = [], metadata] = await paginatedQuery<RepairHistory>(
      statement,
      queryParams,
      parameters
    )

    if (!data.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data, metadata }
  }

  async changeState(
    payload: ChangeStatePayload,
    session: SessionData
  ): Promise<ApiResponse<string>> {
    const { repair_order_id, used_products, new_status: status } = payload

    return this.manager.transaction(async (entityManager) => {
      const order = await entityManager.findOneBy(RepairOrder, {
        repair_order_id,
      })

      if (!order) {
        throw new NotFoundException(
          `Orden de reparación con id '${repair_order_id}' no encontrada. `
        )
      }

      const prevStatus = order.status

      if (prevStatus === status) {
        return { message: 'La orden ya está en el estado deseado.' }
      }

      const user = await entityManager.findOneBy(User, {
        user_id: session.userId,
      })

      const updatedOrder = entityManager.merge(RepairOrder, order, {
        status,
        updated_by: user,
        updated_at: new Date(),
      })

      await entityManager.save(RepairOrder, updatedOrder)

      if (used_products.length) {
        const products: Partial<RepairProduct>[] = []
        for (const item of used_products) {
          const product = await entityManager.findOneBy(ProductDetail, {
            product_detail_id: item.product_id,
            state: 'A',
            stock: MoreThanOrEqual(item.quantity),
          })

          if (!product) {
            throw new NotFoundException(
              `Producto con ID ${item.product_id} no encontrado o stock insuficiente. `
            )
          }

          products.push({
            product,
            repair: updatedOrder,
            created_by: user,
            created_at: new Date(),
            state: 'A',
            quantity: item.quantity,
          })
        }

        const repairProducts = entityManager.create(RepairProduct, products)
        await entityManager.save(RepairProduct, repairProducts)
      }

      await this.createHistory(entityManager, {
        created_by: user,
        created_at: new Date(),
        previous_status: prevStatus,
        new_status: status,
        repair: updatedOrder,
        comment: payload?.comment,
      })

      return { message: 'Orden de reparación actualizada con éxito.' }
    })
  }

  async
}
