import axios, { AxiosError } from 'axios'
import type { ApiResponse } from './types'

export const client = axios.create({
  baseURL: '/api', // vite dev 프록시가 localhost:8080으로 넘겨준다 (vite.config.ts 참고)
  headers: { 'Content-Type': 'application/json' },
})

/**
 * 백엔드 호출 실패(네트워크 오류 또는 success:false 응답)를 구분하기 위한 에러.
 * 화면에서 "백엔드 연결 실패"와 "잘못된 요청"을 다르게 보여주고 싶을 때 kind로 분기한다.
 */
export class ApiError extends Error {
  kind: 'network' | 'server'
  code?: string

  constructor(message: string, kind: 'network' | 'server', code?: string) {
    super(message)
    this.kind = kind
    this.code = code
  }
}

function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const body = err.response?.data as ApiResponse<unknown> | undefined
    if (body?.message) return new ApiError(body.message, 'server', body.code)
    if (err.response) return new ApiError(`요청이 실패했습니다. (${err.response.status})`, 'server')
    return new ApiError('백엔드 서버에 연결할 수 없습니다.', 'network')
  }
  return new ApiError('알 수 없는 오류가 발생했습니다.', 'network')
}

export async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  try {
    const res = await client.get<ApiResponse<T>>(path, { params })
    if (!res.data.success) throw new ApiError(res.data.message, 'server', res.data.code)
    return res.data.data
  } catch (err) {
    throw err instanceof ApiError ? err : toApiError(err)
  }
}

export async function post<T>(path: string, payload: unknown): Promise<T> {
  try {
    const res = await client.post<ApiResponse<T>>(path, payload)
    if (!res.data.success) throw new ApiError(res.data.message, 'server', res.data.code)
    return res.data.data
  } catch (err) {
    throw err instanceof ApiError ? err : toApiError(err)
  }
}
