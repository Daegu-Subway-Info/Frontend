export type LineId = '1' | '2' | '3'

export interface Line {
  id: LineId
  name: string
  shortName: string
  color: string
}

/** [역번호, 역명, 부역명?] — stations.ts 원본 데이터의 한 행 */
export type StationSeed = [code: string, name: string, alias?: string]

/**
 * 환승역은 노선별로 나뉘지 않고 역명 기준 하나로 합쳐진다.
 * 예: 반월당 → lines: ['1', '2'], codes: { '1': '130', '2': '230' }
 */
export interface Station {
  /** 역명 기준 고유 id. 역명과 동일하되 URL에 쓰기 위해 분리해 둔다. */
  id: string
  name: string
  alias?: string
  lines: LineId[]
  codes: Partial<Record<LineId, string>>
  isTransfer: boolean
}

/** 한 노선을 갈아타지 않고 이동하는 구간 */
export interface RouteLeg {
  line: LineId
  /** 승차역부터 하차역까지, 지나는 모든 역을 순서대로 포함 */
  stations: Station[]
  /** 이동 정거장 수 (stations.length - 1) */
  stops: number
  /** 소요 시간(분) */
  minutes: number
  /** 종착역 방면 표기용 */
  direction: string
}

export interface Route {
  from: Station
  to: Station
  legs: RouteLeg[]
  /** 총 소요 시간(분). 환승 시간 포함 */
  totalMinutes: number
  /** 총 정거장 수 */
  totalStops: number
  transferCount: number
  /** 교통카드 기준 요금(원) */
  fare: number
}

export interface RecentRoute {
  fromId: string
  toId: string
  at: number
}
