import { Response } from 'express'
import { HTTP_STATUS_OK } from '../constants/status-codes'
import { ApiResponse } from '../types/api.types'

export function sendResponse<T>(
  resp: Response,
  data: ApiResponse<T>,
  status = HTTP_STATUS_OK
) {
  return resp.status(data.status ?? status).send({ ...data })
}
