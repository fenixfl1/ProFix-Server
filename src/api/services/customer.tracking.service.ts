import * as jwt from 'jsonwebtoken'
import { AppDataSource } from 'src/config/database/ormconfig'
import { Customer } from 'src/entities/Customer'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
} from 'src/types/api.types'
import { CustomerSession } from './user.service'
import {
  BadRequestException,
  UnAuthorizedException,
} from 'src/helpers/error-api'
import { LoginPayload } from 'src/types/session.types'
import { buildWhereClause } from 'src/helpers/build-where-clause'
import { RepairOrder } from 'src/entities/RepairOrder'
import { paginatedQuery } from 'src/helpers/paginated-query'
import { HTTP_STATUS_NO_CONTENT } from 'src/constants/status-codes'

class CustomerTrackingService {
  private customerRepository = AppDataSource.getRepository(Customer)
  async login({
    username,
    password,
  }: LoginPayload): Promise<ApiResponse<CustomerSession>> {
    const customer = await this.customerRepository.findOneBy({
      username,
      password,
    })
    if (!customer) {
      throw new UnAuthorizedException('Usuario o contraseña incorrectos.')
    }

    if (customer.state !== 'A') {
      throw new UnAuthorizedException('No puede iniciar sesión.')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      BadRequestException(
        'Estamos experimentado un error temporal. Por favor intente más tarde.'
      )
    }

    const token = jwt.sign(
      { customer_id: customer.customer_id, username },
      secret,
      { expiresIn: '24h' }
    )

    const expiration = new Date()
    expiration.setDate(expiration.getHours() + 24)

    return {
      data: {
        username,
        customer_id: customer.customer_id,
        name: customer.name,
        sessionCookie: {
          token,
          expiration,
        },
      },
    }
  }

  async getRepairOrders(
    conditions: AdvancedCondition[],
    customer_id: string,
    queryParams: QueryParams
  ): Promise<ApiResponse<any>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
      select 
          *
        from (
          select ro.repair_order_id,
          ro.state,
          ro.diagnosis,
          d.customer_id,
          ro.delivery_date,
          ro.status,
          ro.estimated_cost,
          ro.reported_issue,
          ro.advanced_payment,
          ro.created_at,
          c.name,
          c.phone,
          c.identity_document,
          c.email,
          c.address customer_address,
          d.model,
          d.color,
          d.imei,
          d.physical_condition,
          pb.name as brand,
          concat_ws(
            coalesce(pb.name, ''), ' ',
            coalesce(cast(d.imei as char), ''), ' ',
            coalesce(cast(d.model as char), ''), ' ',
            coalesce(cast(ro.repair_order_id as char), ''), ' ',
            coalesce(c.name, ''), ' '
            ) collate utf8mb4_unicode_ci as filter
        from repair_order ro
           left join device d on ro.device_id = d.device_id
           left join phone_brands pb on d.brand_id = pb.brand_id
           left join user u on ro.assigned_staff_id = u.user_id
           left join customer c on d.customer_id = c.customer_id
           left join user uc on ro.created_by = uc.user_id
        where
          c.customer_id = ${customer_id}
        ) subquery
      where 
        ${whereClause}
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

    return { data, metadata }
  }
}

export default CustomerTrackingService
