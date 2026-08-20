/**
 * 백엔드(Daegu-Subway-Info/Backend) 응답 DTO를 그대로 옮긴 타입.
 * 백엔드 소스: src/main/java/com/capstone/subway/**\/dto/*.java
 * 백엔드에 없는 필드는 여기도 없다 — 프론트에서 임의로 추가하지 않는다.
 */

export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
}

export interface LineResponse {
  id: number
  lineName: string
  lineColor: string
}

export interface StationResponse {
  id: number
  stationName: string
  stationCode: string | null
  lineId: number
  lineName: string
  sequenceNo: number | null
  latitude: number | null
  longitude: number | null
}

export interface LineDetailResponse {
  id: number
  lineName: string
  lineColor: string
  stations: StationResponse[]
}

export interface StationSearchResponse {
  keyword: string
  count: number
  stations: StationResponse[]
}

export interface RouteRequest {
  fromStationId: number
  toStationId: number
}

export interface RouteResponse {
  path: StationResponse[]
  totalDistanceKm: number
  totalDurationSeconds: number
  transferCount: number
  fare: number
}
