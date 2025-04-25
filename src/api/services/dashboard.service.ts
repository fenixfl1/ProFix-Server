import { AppDataSource } from 'src/config/database/ormconfig'
import { RepairOrder } from 'src/entities/RepairOrder'
import { mysqlDateFormat, queryRunner } from 'src/helpers/query-utils'
import { ApiResponse } from 'src/types/api.types'

export interface DashboardPayload {
  labels: string[]
  data: number[]
}

export interface QueryResult {
  [key: string]: string
}

class DashboardService {
  private repairOrderRepository = AppDataSource.getRepository(RepairOrder)

  async getRepairOrderByStatus(): Promise<ApiResponse<DashboardPayload>> {
    const result = await this.repairOrderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany()

    return {
      data: {
        labels: result.map((item) => item.status),
        data: result.map((item) => parseInt(item.count, 10)),
      },
    }
  }

  async getRepairOrderByMonth(): Promise<ApiResponse<DashboardPayload>> {
    const statement = `
      SELECT 
        ${mysqlDateFormat('created_at')} AS month, 
        COUNT(*) AS count
      FROM 
        repair_order
      GROUP BY month
      ORDER BY MIN(created_at)
    `

    const result = await queryRunner<QueryResult>(statement)

    return {
      data: {
        labels: result.map((item) => item.month),
        data: result.map((item) => parseInt(item.count, 10)),
      },
    }
  }

  async getMonthlyIncome(): Promise<ApiResponse<DashboardPayload>> {
    const statement = `
      SELECT 
        ${mysqlDateFormat('created_at')} AS month,
        SUM(estimated_cost) AS income
      FROM 
        repair_order
      GROUP BY month
      ORDER BY MIN(created_at)
    `

    const result = await queryRunner<QueryResult>(statement)

    return {
      data: {
        labels: result.map((r) => r.month),
        data: result.map((r) => parseFloat(r.income)),
      },
    }
  }

  async getMostCommonDevices(): Promise<ApiResponse<DashboardPayload>> {
    const statement = `
      SELECT 
        model, 
        COUNT(*) AS count
      FROM 
        device
      WHERE 
        model IS NOT NULL
      GROUP BY model
      ORDER BY count DESC
    `

    const result = await queryRunner<QueryResult>(statement)

    return {
      data: {
        labels: result.map((r) => r.model),
        data: result.map((r) => parseInt(r.count, 10)),
      },
    }
  }

  async getNewCustomersPerMonth(): Promise<ApiResponse<DashboardPayload>> {
    const statement = `
      SELECT 
        ${mysqlDateFormat('created_at')} AS month, 
        COUNT(*) AS count
      FROM 
        customer
      GROUP BY month
      ORDER BY MIN(created_at)
    `

    const result = await queryRunner<QueryResult>(statement)

    return {
      data: {
        labels: result.map((r) => r.month),
        data: result.map((r) => parseInt(r.count, 10)),
      },
    }
  }

  async getAverageRepairTimeInDays(): Promise<
    ApiResponse<{ average_days: number }>
  > {
    const statement = `
      SELECT 
        ROUND(AVG(DATEDIFF(updated_at, created_at)), 2) AS avg_days
      FROM 
        repair_order ro
      WHERE 
        ro.updated_at IS NOT NULL
    `

    const [result] = await queryRunner<QueryResult>(statement)

    return {
      data: {
        average_days: parseFloat(result.avg_days),
      },
    }
  }

  async getNewAndRecurrentCustomers(): Promise<
    ApiResponse<{ new_customers: number; recurrent_customers: number }>
  > {
    // Consulta para obtener los clientes nuevos
    const newCustomersStatement = `
      SELECT 
        COUNT(DISTINCT customer_id) AS new_customers
      FROM 
        repair_order
      WHERE 
        created_at >= NOW() - INTERVAL 1 MONTH;
    `

    // Consulta para obtener los clientes recurrentes
    const recurrentCustomersStatement = `
      SELECT 
        COUNT(DISTINCT customer_id) AS recurrent_customers
      FROM 
        repair_order
      WHERE 
        created_at >= NOW() - INTERVAL 1 YEAR
      GROUP BY 
        customer_id
      HAVING 
        COUNT(customer_id) > 1;
    `

    // Ejecutar ambas consultas
    const [newCustomersResult] = await queryRunner<QueryResult>(
      newCustomersStatement
    )
    const [recurrentCustomersResult] = await queryRunner<QueryResult>(
      recurrentCustomersStatement
    )

    return {
      data: {
        new_customers: parseInt(newCustomersResult.new_customers, 10) || 0,
        recurrent_customers:
          parseInt(recurrentCustomersResult.recurrent_customers, 10) || 0,
      },
    }
  }
}

export default DashboardService
