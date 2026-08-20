import { useQuery } from '@tanstack/react-query'
import { findRoute, getLineDetail, getLines, getStationDetail, getStations, searchStations } from './backend'

export const queryKeys = {
  lines: ['lines'] as const,
  lineDetail: (lineId: number) => ['lines', lineId] as const,
  stations: ['stations'] as const,
  stationDetail: (stationId: number) => ['stations', stationId] as const,
  stationSearch: (keyword: string) => ['stations', 'search', keyword] as const,
  route: (fromId: number, toId: number) => ['routes', fromId, toId] as const,
}

export function useLinesQuery() {
  return useQuery({ queryKey: queryKeys.lines, queryFn: getLines })
}

export function useLineDetailQuery(lineId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.lineDetail(lineId ?? -1),
    queryFn: () => getLineDetail(lineId as number),
    enabled: lineId !== undefined,
  })
}

export function useStationsQuery() {
  return useQuery({ queryKey: queryKeys.stations, queryFn: getStations })
}

export function useStationDetailQuery(stationId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.stationDetail(stationId ?? -1),
    queryFn: () => getStationDetail(stationId as number),
    enabled: stationId !== undefined,
  })
}

export function useStationSearchQuery(keyword: string) {
  return useQuery({
    queryKey: queryKeys.stationSearch(keyword),
    queryFn: () => searchStations(keyword),
    enabled: keyword.trim().length > 0,
  })
}

export function useRouteQuery(fromId: number | undefined, toId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.route(fromId ?? -1, toId ?? -1),
    queryFn: () => findRoute(fromId as number, toId as number),
    enabled: fromId !== undefined && toId !== undefined,
    retry: 0, // 잘못된 역 조합(400) 재시도해봐야 소용없음
  })
}
