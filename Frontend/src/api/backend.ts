import { get, post } from './http'
import type {
  LineDetailResponse,
  LineResponse,
  RouteRequest,
  RouteResponse,
  StationResponse,
  StationSearchResponse,
} from './types'

/**
 * 백엔드가 실제로 구현한 엔드포인트만 그대로 연결한다.
 * (Backend README "# API" 섹션, RouteController/StationController/LineController 기준)
 * 백엔드에 없는 기능(초성 검색, 거리 기반 임의 요금 계산 등)은 여기 추가하지 않는다.
 */

export function getLines(): Promise<LineResponse[]> {
  return get('/api/lines')
}

export function getLineDetail(lineId: number): Promise<LineDetailResponse> {
  return get(`/api/lines/${lineId}`)
}

export function getStations(): Promise<StationResponse[]> {
  return get('/api/stations')
}

export function getStationDetail(stationId: number): Promise<StationResponse> {
  return get(`/api/stations/${stationId}`)
}

export function searchStations(keyword: string): Promise<StationSearchResponse> {
  return get(`/api/stations/search?keyword=${encodeURIComponent(keyword)}`)
}

export function findRoute(fromStationId: number, toStationId: number): Promise<RouteResponse> {
  const payload: RouteRequest = { fromStationId, toStationId }
  return post('/api/routes', payload)
}
