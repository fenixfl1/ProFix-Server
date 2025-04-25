import { AppDataSource } from 'src/config/database/ormconfig'
import { HTTP_STATUS_NO_CONTENT } from 'src/constants/status-codes'
import { Customer } from 'src/entities/Customer'
import { User } from 'src/entities/User'
import { buildWhereClause } from 'src/helpers/build-where-clause'
import { NotFoundException, UnAuthorizedException } from 'src/helpers/error-api'
import { generatePassword } from '../../helpers/generate-password'
import { paginatedQuery } from 'src/helpers/paginated-query'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
  SessionData,
} from 'src/types/api.types'

export class CustomerService {
  private customerRepository = AppDataSource.getRepository(Customer)
  private userRepository = AppDataSource.getRepository(User)
  private manager = AppDataSource.manager

  /**
   * Create a new customer
   * @param customer - Customer object
   * @return the created customer
   */
  async create(
    payload: Customer,
    session: SessionData
  ): Promise<ApiResponse<Customer>> {
    const username = await this.generateUsername(payload.name)
    const password = generatePassword()

    const created_by = await this.userRepository.findOneBy({
      user_id: session.userId,
    })
    if (!created_by) {
      throw new UnAuthorizedException('Unauthorized to create a customer')
    }

    const customer = this.customerRepository.create({
      ...payload,
      username,
      password,
      created_by,
    })

    await this.customerRepository.save(customer)

    const newCustomer = await this.customerRepository.findOneBy({ username })

    return { data: newCustomer }
  }

  /**
   * Update an existing customer
   * @param customer - Customer object
   * @return the updated customer
   */
  async update(
    payload: Customer,
    session: SessionData
  ): Promise<ApiResponse<Customer>> {
    const customer = await this.customerRepository.findOneBy({
      customer_id: payload.customer_id,
    })

    if (!customer) {
      throw new NotFoundException(
        `Customer with id '${payload.customer_id}' not found.`
      )
    }

    const updated_by = await this.userRepository.findOneBy({
      user_id: session.userId,
    })
    if (!updated_by) {
      throw new UnAuthorizedException('Unauthorized to update a customer')
    }

    payload.updated_by = updated_by
    payload.updated_at = new Date()

    const newCustomer = this.customerRepository.merge(customer, payload)
    await this.customerRepository.save(newCustomer)

    return { message: 'Cliente actualizado con éxito' }
  }

  /**
   * Get a list of customer
   * @param conditions - Conditions to filter the customers
   * @param queryParams - Query parameters to paginate the customers
   * @return the list of customers
   */
  async getCustomers(
    conditions: AdvancedCondition[],
    queryParam: QueryParams
  ): Promise<ApiResponse<Customer[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = `
      SELECT 
        *
      FROM  (
        SELECT 
        concat_ws(
            coalesce(C.name, ''), ' ',
            coalesce(C.phone, ''), ' ',
            coalesce( C.email, ' '), ' ',
            coalesce(C.identity_document, ' '), ' ',
            coalesce( C.username, ' ')
          ) AS filter,
          C.customer_id,
          C.name,
          C.phone,
          C.email,
          C.address,
          C.created_at,
          C.updated_at,
          C.state,
          C.created_by,
          C.updated_by,
          C.identity_document,
          C.username
        FROM 
          customer C
      ) subquery
      WHERE 
        ${whereClause} 
      ORDER BY 
        customer_id ASC
    `

    const [data = [], metadata] = await paginatedQuery<Customer>(
      statement,
      queryParam,
      parameters
    )

    if (!data.length) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data, metadata }
  }

  /**
   * Get a customer by his id
   * @param customer_id - The id of the customer
   * @returns the customer info
   */
  async getCustomerById(customer_id: number): Promise<ApiResponse<Customer>> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id },
      relations: ['devices'],
    })
    if (!customer) {
      throw new NotFoundException(
        `Cliente with id '${customer_id}' no encontrado.`
      )
    }

    return { data: customer }
  }

  /**
   * Generate a username for a customer
   * @param name - The name of the customer
   * @return the generated username
   */
  private async generateUsername(name: string): Promise<string> {
    const baseUsername = name.toLowerCase().replace(/\s+/g, '').substring(0, 5)
    let username = baseUsername
    let exists = await this.customerRepository.findOne({ where: { username } })

    while (exists) {
      const randomSuffix = Math.floor(Math.random() * 10000)
      username = `${baseUsername}${randomSuffix}`
      exists = await this.customerRepository.findOne({ where: { username } })
    }

    return username
  }
}
