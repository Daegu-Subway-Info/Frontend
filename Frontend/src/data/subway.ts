import type { LineId, Station } from '../types/subway'
import { LINE_IDS, LINE_SEEDS } from './stations'

/**
 * 노선별 시드를 역명 기준으로 합쳐 전체 역 목록을 만든다.
 * 환승역(명덕·반월당·청라언덕)은 두 노선의 정보를 가진 하나의 Station이 된다.
 */
function buildStations(): { all: Station[]; byLine: Record<LineId, Station[]> } {
  const byName = new Map<string, Station>()
  const byLine = { '1': [], '2': [], '3': [] } as Record<LineId, Station[]>

  for (const lineId of LINE_IDS) {
    for (const [code, name, alias] of LINE_SEEDS[lineId]) {
      let station = byName.get(name)
      if (!station) {
        station = { id: name, name, alias, lines: [], codes: {}, isTransfer: false }
        byName.set(name, station)
      }
      station.lines.push(lineId)
      station.codes[lineId] = code
      station.isTransfer = station.lines.length > 1
      if (alias && !station.alias) station.alias = alias
      byLine[lineId].push(station)
    }
  }

  return { all: [...byName.values()], byLine }
}

const built = buildStations()

export const ALL_STATIONS: Station[] = built.all
export const STATIONS_BY_LINE: Record<LineId, Station[]> = built.byLine

const stationIndex = new Map(ALL_STATIONS.map((s) => [s.id, s]))

export function getStation(id: string): Station | undefined {
  return stationIndex.get(id)
}

/** 해당 노선에서 역이 몇 번째인지. 없으면 -1 */
export function indexOnLine(lineId: LineId, station: Station): number {
  return STATIONS_BY_LINE[lineId].indexOf(station)
}

/** 같은 노선에서 바로 앞뒤 역 */
export function neighborsOnLine(lineId: LineId, station: Station): Station[] {
  const list = STATIONS_BY_LINE[lineId]
  const i = list.indexOf(station)
  if (i === -1) return []
  return [list[i - 1], list[i + 1]].filter(Boolean)
}

export const TRANSFER_STATIONS: Station[] = ALL_STATIONS.filter((s) => s.isTransfer)
