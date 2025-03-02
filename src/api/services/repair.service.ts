import { AppDataSource } from 'src/config/database/ormconfig'
import { HTTP_STATUS_NO_CONTENT } from 'src/constants/status-codes'
import { Repair } from 'src/entities/Repair'
import { buildWhereClause } from 'src/helpers/build-where-clause'
import { paginatedQuery } from 'src/helpers/paginated-query'
import {
  AdvancedCondition,
  ApiResponse,
  QueryParams,
} from 'src/types/api.types'

export class RepairService {
  private repairRepository = AppDataSource.getRepository(Repair)

  /**
   * Create a new repair
   * @param repairData - The data for the new repair
   * @returns The created repair
   */
  async create(repairData: Repair): Promise<ApiResponse<Repair>> {
    return {}
  }

  /**
   * Update an existing repair
   * @param repaidData - The data for the updated repair
   * @return The updated repair
   */
  async update(repaidData: Repair): Promise<ApiResponse<Repair>> {
    return {}
  }

  /**
   * Get all repairs
   * @param conditions: The condition for the repairs
   * @returns The list of repairs
   */
  async getRepairs(
    conditions: AdvancedCondition[],
    searchParams: QueryParams
  ): Promise<ApiResponse<Repair[]>> {
    const { whereClause, parameters } = buildWhereClause(conditions)

    const statement = ``

    const [data = [], metadata] = await paginatedQuery<Repair>(
      statement,
      searchParams,
      parameters
    )

    if (data.length === 0) {
      return { status: HTTP_STATUS_NO_CONTENT }
    }

    return { data, metadata }
  }
}
