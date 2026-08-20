import { STATIONS_BY_LINE } from '../data/subway'
import { LINE_IDS } from '../data/stations'
import type { LineId, Route, RouteLeg, Station } from '../types/subway'

/**
 * 클라이언트 임시 경로 탐색.
 *
 * 실제 서비스는 공공 시간표(열차번호별 역 도착시각)를 쓰는 서버 계산으로 대체된다.
 * 여기서는 화면을 붙이기 위한 근사치만 낸다 — 역간 균일 소요시간 가정.
 * src/api 의 mock 구현에서만 호출할 것. 화면에서 직접 부르지 말 것.
 */
const MINUTES_PER_STOP = 2
const TRANSFER_MINUTES = 4
const BASE_FARE = 1500

type NodeKey = `${LineId}:${string}`

const key = (line: LineId, station: Station): NodeKey => `${line}:${station.id}`

interface Visit {
  line: LineId
  station: Station
  cost: number
  prev: Visit | null
}

function buildEdges(): Map<NodeKey, Array<{ line: LineId; station: Station; cost: number }>> {
  const edges = new Map<NodeKey, Array<{ line: LineId; station: Station; cost: number }>>()
  const push = (from: NodeKey, to: { line: LineId; station: Station; cost: number }) => {
    const list = edges.get(from)
    if (list) list.push(to)
    else edges.set(from, [to])
  }

  for (const line of LINE_IDS) {
    const stations = STATIONS_BY_LINE[line]
    stations.forEach((station, i) => {
      const prev = stations[i - 1]
      const next = stations[i + 1]
      if (prev) push(key(line, station), { line, station: prev, cost: MINUTES_PER_STOP })
      if (next) push(key(line, station), { line, station: next, cost: MINUTES_PER_STOP })
      // 환승: 같은 역의 다른 노선 승강장으로 이동
      for (const other of station.lines) {
        if (other !== line) {
          push(key(line, station), { line: other, station, cost: TRANSFER_MINUTES })
        }
      }
    })
  }
  return edges
}

const EDGES = buildEdges()

/** 다익스트라. 노선 수가 3개뿐이라 정렬 기반 단순 구현으로 충분하다. */
function search(from: Station, to: Station): Visit | null {
  const best = new Map<NodeKey, number>()
  const queue: Visit[] = from.lines.map((line) => ({ line, station: from, cost: 0, prev: null }))
  queue.forEach((v) => best.set(key(v.line, v.station), 0))

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost)
    const current = queue.shift()!
    if (current.station.id === to.id) return current
    if (current.cost > (best.get(key(current.line, current.station)) ?? Infinity)) continue

    for (const edge of EDGES.get(key(current.line, current.station)) ?? []) {
      const nextKey = key(edge.line, edge.station)
      const nextCost = current.cost + edge.cost
      if (nextCost < (best.get(nextKey) ?? Infinity)) {
        best.set(nextKey, nextCost)
        queue.push({ line: edge.line, station: edge.station, cost: nextCost, prev: current })
      }
    }
  }
  return null
}

/** 탐색 결과 경로를 노선이 바뀌는 지점마다 잘라 RouteLeg 배열로 만든다. */
function toLegs(tail: Visit): RouteLeg[] {
  const path: Visit[] = []
  for (let v: Visit | null = tail; v; v = v.prev) path.unshift(v)

  const legs: RouteLeg[] = []
  let current: Station[] = []
  let currentLine: LineId | null = null

  const flush = () => {
    if (currentLine && current.length > 1) {
      const stops = current.length - 1
      legs.push({
        line: currentLine,
        stations: current,
        stops,
        minutes: stops * MINUTES_PER_STOP,
        direction: directionOf(currentLine, current[0], current[current.length - 1]),
      })
    }
  }

  for (const visit of path) {
    if (visit.line !== currentLine) {
      flush()
      // 환승 지점은 이전 구간의 종착역이자 새 구간의 시작역이다
      current = [visit.station]
      currentLine = visit.line
    } else {
      current.push(visit.station)
    }
  }
  flush()
  return legs
}

/** 진행 방향 종점역 이름 ('영남대 방면') */
function directionOf(line: LineId, from: Station, to: Station): string {
  const stations = STATIONS_BY_LINE[line]
  const forward = stations.indexOf(to) > stations.indexOf(from)
  const terminal = forward ? stations[stations.length - 1] : stations[0]
  return `${terminal.name} 방면`
}

export function findRoute(from: Station, to: Station): Route | null {
  if (from.id === to.id) return null
  const tail = search(from, to)
  if (!tail) return null

  const legs = toLegs(tail)
  const totalStops = legs.reduce((sum, leg) => sum + leg.stops, 0)
  const transferCount = Math.max(0, legs.length - 1)

  return {
    from,
    to,
    legs,
    totalStops,
    transferCount,
    totalMinutes: totalStops * MINUTES_PER_STOP + transferCount * TRANSFER_MINUTES,
    fare: BASE_FARE,
  }
}
