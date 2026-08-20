import type { ApiResponse } from './types'

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })
  } catch {
    throw new ApiError('백엔드 서버에 연결할 수 없습니다.', 'network')
  }

  let body: ApiResponse<T>
  try {
    body = await res.json()
  } catch {
    throw new ApiError('백엔드 응답을 해석할 수 없습니다.', 'network')
  }

  if (!res.ok || !body.success) {
    throw new ApiError(body.message ?? '요청이 실패했습니다.', 'server', body.code)
  }

  return body.data
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path)
}

export function post<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(payload) })
}
