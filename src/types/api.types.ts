import { Request } from 'express'
import Business from 'src/entities/Business'

export type PaginationLinks = {
  nextPage: Nullable<string>
  previousPage: Nullable<string>
}

export interface Metadata {
  pagination: {
    currentPage: number
    totalPages: number
    totalRows: number
    count: number
    pageSize: number
    links?: PaginationLinks
  }
}

export interface ApiResponse<T = unknown> {
  error?: boolean
  errorType?: string
  errorCode?: string
  message?: string
  data?: T
  metadata?: Metadata
  status?: number
}

export type Nullable<T> = T | null

export interface CustomRequest<T = unknown> extends Request {
  sessionInfo: SessionData
  body: T
  query: any
  headers: any
  socket: any
  params: Record<string, string>
  url: any
}

export interface SessionData {
  ipAddress: string
  userId: number
  business: Business
}

export interface SimpleCondition<T = unknown> {
  fields?: Array<keyof T>
  condition: { [P in keyof Partial<T>]: T[P] }
}

export interface AdvancedCondition<T = unknown> {
  value: string | number | boolean | Array<string | number>
  field: keyof T
  operator: QueryOperators
}

export type QueryDataType = 'DATE' | 'STRING' | 'NUMBER' | 'ARRAY' | 'BOOLEAN'

export type QueryParams = {
  page?: number
  size?: number
}

export type QueryOperators =
  | '='
  | '!='
  | 'LIKE'
  | 'ILIKE'
  | '>'
  | '<>'
  | '>='
  | '<'
  | '<='
  | 'OR ='
  | 'IN'
  | 'NOT IN'
  | 'IS NULL'
  | 'BETWEEN'

export type ParamsLocation = 'body' | 'query' | 'params'
