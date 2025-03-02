import { AppDataSource } from 'src/config/database/ormconfig'
import { HTTP_STATUS_NO_CONTENT } from 'src/constants/status-codes'
import { Customer } from 'src/entities/Customer'
import { buildWhereClause } from 'src/helpers/build-where-clause'
import { generatePassword } from 'src/helpers/generate-password'
import { paginatedQuery } from 'src/helpers/paginated-query'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
} from 'src/types/api.types'

export class CustomerService {
  private customerRepository = AppDataSource.getRepository(Customer)
  private manager = AppDataSource.manager

  /**
   * Create a new customer
   * @param customer - Customer object
   * @return the created customer
   */
  async create(payload: Customer): Promise<ApiResponse<Customer>> {
    return this.manager.transaction(async (transaction) => {
      const username = await this.generateUsername(payload.name)
      const password = generatePassword()

      const customer = await transaction.insert(Customer, {
        ...payload,
        username,
        password,
      })

      // eslint-disable-next-line no-console
      console.log({ customer })

      return { data: customer as never }
    })
  }

  /**
   * Update an existing customer
   * @param customer - Customer object
   * @return the updated customer
   */
  async update(customer: Customer): Promise<ApiResponse<Customer>> {
    return {}
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

    const statement = `SELECT * FROM customer WHERE ${whereClause} ORDER BY customer_id ASC`

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
