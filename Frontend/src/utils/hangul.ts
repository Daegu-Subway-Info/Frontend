const CHO = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]

const HANGUL_BASE = 0xac00
const HANGUL_LAST = 0xd7a3

/** '반월당' → 'ㅂㅇㄷ' */
export function toChoseong(text: string): string {
  let out = ''
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
      out += CHO[Math.floor((code - HANGUL_BASE) / 588)]
    } else {
      out += ch
    }
  }
  return out
}

/** 입력이 초성만으로 이루어졌는지 (예: 'ㅂㅇㄷ') */
export function isChoseongOnly(text: string): boolean {
  return text.length > 0 && [...text].every((ch) => CHO.includes(ch))
}

/**
 * 역명 검색 매칭.
 * - 초성만 입력하면 초성 매칭 ('ㅂㅇㄷ' → 반월당)
 * - 그 외에는 역명·부역명 부분 일치
 */
export function matchStation(query: string, name: string, alias?: string): boolean {
  const q = query.replace(/\s/g, '')
  if (!q) return false
  if (isChoseongOnly(q)) {
    return toChoseong(name).includes(q) || (alias ? toChoseong(alias).includes(q) : false)
  }
  return name.includes(q) || (alias ? alias.includes(q) : false)
}
