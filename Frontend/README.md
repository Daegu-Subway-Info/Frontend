# Daegu Subway Info — Frontend

대구 도시철도 경로 탐색 및 열차 시간표 안내 시스템의 프론트엔드.

기초 틀만 잡은 단계입니다. 검색/경로 도메인 화면만 담당합니다.

- 홈 화면
- 역 검색
- 경로 탐색 결과
- 노선도
- 역 상세정보

## 스택

React 19 + TypeScript + Vite, React Router, MUI, Zustand, Axios, TanStack Query

## 실행

백엔드([Backend 저장소](https://github.com/Daegu-Subway-Info/Backend))를 먼저 `8080` 포트로 띄웁니다.

```bash
./gradlew bootRun
```

프론트엔드 실행:

```bash
npm install
npm run dev
```

`/api` 요청은 `vite.config.ts` 프록시로 `localhost:8080`에 전달됩니다.

## 폴더 구조

```
src/
  api/        axios 클라이언트, 타입, TanStack Query 훅
  components/ 공통 컴포넌트
  pages/      화면별 컴포넌트
  store/      Zustand 스토어
  utils/
  theme.ts
```

## 참고

- 요금은 프론트에서 계산하지 않고 `/api/routes` 응답값을 그대로 표시합니다.
- 환승역은 `GET /api/stations` 전체를 역명 기준으로 묶어서 판단합니다 (백엔드는 노선별로 row가 분리되어 있음).
