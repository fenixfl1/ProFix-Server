import { PaginationLinks, QueryParams, Metadata } from '../types/api.types'
import { queryRunner } from './query-utils'
import {
  DEFAULT_PAGINATION_PAGE_NUMBER,
  DEFAULT_PAGINATION_PAGE_SIZE,
} from '../constants/general'
import { SelectQueryBuilder } from 'typeorm'
import { BadRequestException } from './error-api'

const getNextPageUrl = (queryParams: QueryParams): string => {
  return generateUrl({ ...queryParams, page: queryParams.page + 1 })
}

const generateUrl = (queryParams: QueryParams): string => {
  const params = Object.entries(queryParams).map(
    ([key, value]) => `${key}=${value}`
  )

  return `?${params.join('&')}`
}

const getPreviousPageUrl = (queryParams: QueryParams): string => {
  return generateUrl({ ...queryParams, page: queryParams.page - 1 })
}

const getPaginationLinks = (
  totalPages: number,
  queryParams: QueryParams
): PaginationLinks => {
  const { page: pageNumber } = queryParams
  const hasNextPage = pageNumber < totalPages
  const hasPreviousPage =
    pageNumber > DEFAULT_PAGINATION_PAGE_NUMBER && pageNumber <= totalPages

  return {
    nextPage: hasNextPage ? getNextPageUrl(queryParams) : null,
    previousPage: hasPreviousPage ? getPreviousPageUrl(queryParams) : null,
  }
}

export const getQueryMetadata = (
  resultCount: number,
  totalPages: number,
  queryParams: QueryParams,
  totalRows: number
): Metadata => {
  const { page: pageNumber, size: pageSize } = queryParams

  return {
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalRows,
      pageSize,
      count: resultCount,
      links: getPaginationLinks(totalPages, queryParams),
    },
  }
}

export const paginatedQuery = async <T>(
  queryElement: string,
  queryParams: QueryParams,
  whereParams: string[]
): Promise<[T[], Metadata]> => {
  const {
    page: pageNumber = DEFAULT_PAGINATION_PAGE_NUMBER,
    size: pageSize = DEFAULT_PAGINATION_PAGE_SIZE,
  } = queryParams

  const startPosition = pageSize * (pageNumber - 1)

  const mainQuerySql =
    typeof queryElement === 'string' ? queryElement : queryElement

  const paginatedQuerySql = `
    ${mainQuerySql}
    LIMIT ${pageSize} OFFSET ${startPosition}
  `

  try {
    const result = await queryRunner<T>(paginatedQuerySql, whereParams)

    const [{ ROWCOUNT = 0 }] = await queryRunner<{ ROWCOUNT: number }>(
      `SELECT COUNT(*) AS ROWCOUNT FROM (${mainQuerySql}) AS count_table`,
      whereParams
    )

    const totalPages = Math.ceil(ROWCOUNT / pageSize)

    const meta = getQueryMetadata(
      result.length,
      totalPages,
      queryParams,
      ROWCOUNT
    )

    return [result, meta]
  } catch (e) {
    BadRequestException(`Error executing paginated query: ${e?.message}`)
  }
}
