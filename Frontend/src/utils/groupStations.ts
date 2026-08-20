import type { StationResponse } from '../api/types'

/**
 * 백엔드는 역을 노선별 row로 따로 저장한다 (반월당 1호선 row / 2호선 row가 별개).
 * "이 역이 환승역인지, 다른 어느 노선과 이어지는지"는 별도 엔드포인트가 없어서
 * GET /api/stations 전체 목록을 역명 기준으로 묶어 클라이언트에서 판단한다.
 */
export function groupByName(stations: StationResponse[]): Map<string, StationResponse[]> {
  const map = new Map<string, StationResponse[]>()
  for (const s of stations) {
    const list = map.get(s.stationName)
    if (list) list.push(s)
    else map.set(s.stationName, [s])
  }
  return map
}

export function isTransferStation(stations: StationResponse[]): boolean {
  return stations.length > 1
}
