import { ALL_STATIONS, getStation as getStationById } from '../data/subway'
import { matchStation } from '../utils/hangul'
import { findRoute as computeRoute } from '../utils/routing'
import type { Route, Station } from '../types/subway'

/**
 * 임시 API 레이어.
 *
 * 백엔드(Daegu-Subway-Info/Backend)의 실제 엔드포인트를 흉내 낸 함수들이다.
 * 지금은 로컬 정적 데이터로 응답하지만, 함수 시그니처와 반환 형태는
 * 실제 REST 호출로 바꿀 때 호출부(페이지 컴포넌트)를 건드리지 않아도 되도록 맞춰뒀다.
 *
 * 대응하는 실제 엔드포인트:
 * - searchStations → GET /api/stations/search?keyword=
 * - getStation     → GET /api/stations/{stationId}
 * - findRoute      → POST /api/routes { fromStationId, toStationId }
 *
 * 백엔드가 배포되면 이 파일 내부 구현만 fetch 호출로 교체하면 된다.
 */

const MOCK_DELAY_MS = 150

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS))
}

export async function searchStations(keyword: string): Promise<Station[]> {
  const trimmed = keyword.trim()
  if (!trimmed) return delay(ALL_STATIONS)
  const result = ALL_STATIONS.filter((s) => matchStation(trimmed, s.name, s.alias))
  return delay(result)
}

export async function getStation(id: string): Promise<Station | null> {
  return delay(getStationById(id) ?? null)
}

export async function getAllStations(): Promise<Station[]> {
  return delay(ALL_STATIONS)
}

export async function findRoute(fromId: string, toId: string): Promise<Route | null> {
  const from = getStationById(fromId)
  const to = getStationById(toId)
  if (!from || !to) return delay(null)
  return delay(computeRoute(from, to))
}
