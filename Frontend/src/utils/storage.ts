/** localStorage JSON 헬퍼. SSR은 없지만 접근 실패(프라이빗 모드 등)에 대비해 감싸둔다. */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장 실패는 무시 — 알림 기능이 아니라 편의 기능이라 조용히 넘어간다.
  }
}
