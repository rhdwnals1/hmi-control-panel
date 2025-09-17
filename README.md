# HMI Control Panel

<img width="1920" height="1080" alt="스크린샷 2025-09-17 오후 1 14 03(2)" src="https://github.com/user-attachments/assets/ac1a322b-4935-42b7-a4cb-d82d72eafcf8" />
<img width="1335" height="886" alt="스크린샷 2025-09-17 오후 6 07 46" src="https://github.com/user-attachments/assets/43d4b9e3-1c0a-485f-9059-c48631be4cd6" />


## 개요

HMI Control Panel은 산업용 제어 시스템을 위한 실시간 모니터링 대시보드입니다. 수조(Tank) 시스템의 실시간 데이터를 시각화하고 제어할 수 있는 웹 기반 인터페이스를 제공합니다.

## 주요 기능

### 📊 실시간 데이터 모니터링

- **KPI 타일**: 용존산소(DO), 수온, pH, 염도 등 핵심 지표를 실시간으로 표시
- **트렌드 차트**: 시계열 데이터를 직관적인 라인 차트로 시각화
- **데이터 품질**: 각 태그의 데이터 품질 상태를 실시간으로 모니터링

### 🚨 알람 관리

- **Critical 알람 배너**: 긴급 알람 발생 시 상단에 고정 배너 표시
- **알람 리스트**: 심각도별(CRIT/MAJ/MIN/INFO) 알람 목록 관리
- **알람 확인(ACK)**: 운영자가 알람을 확인 처리할 수 있는 기능

### 🎛️ 디바이스 제어

- **페이스플레이트**: 각 디바이스의 상태 표시 및 제어 버튼
- **안전 명령**: START/STOP/RESET 명령 실행 시 확인 모달 표시
- **인터락 시스템**: 안전한 제어를 위한 확인 절차

### 📈 고급 차트 기능

- **시리즈 토글**: 차트에 표시할 데이터 시리즈를 선택적으로 제어
- **다중 시간축**: 빠른 창(초 단위)과 느린 창(24시간) 차트 제공
- **자동 프로모션**: 특정 임계값 초과 시 해당 시리즈 자동 활성화

## 기술 스택

- **Frontend**: React 19, TypeScript
- **스타일링**: Styled Components
- **상태 관리**: Zustand
- **차트**: Recharts
- **빌드 도구**: Vite
- **개발 도구**: ESLint

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── AlarmBanner.tsx     # Critical 알람 배너
│   ├── AlarmList.tsx       # 알람 목록
│   ├── Faceplate.tsx       # 디바이스 페이스플레이트
│   ├── KpiTile.tsx         # KPI 타일
│   ├── SafeCommandButton.tsx # 안전 명령 버튼
│   └── TrendPanel.tsx      # 트렌드 차트 패널
├── pages/               # 페이지 컴포넌트
│   └── TankDetailPage.tsx  # 메인 탱크 상세 페이지
├── store/               # 상태 관리
│   └── liveStore.ts        # 실시간 데이터 스토어
├── lib/                 # 유틸리티 라이브러리
│   └── mockStream.ts       # 모의 데이터 스트림
├── utils/               # 헬퍼 함수
│   └── time.ts             # 시간 관련 유틸리티
└── types.ts             # TypeScript 타입 정의
```

## 설치 및 실행

### 필요 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 개발 서버 접속

개발 서버 실행 후 `http://localhost:5173` (또는 표시된 포트)에서 애플리케이션을 확인할 수 있습니다.

## 주요 컴포넌트 설명

### TankDetailPage

메인 대시보드 페이지로, 모든 모니터링 및 제어 기능을 통합하여 제공합니다.

### KpiTile

KPI 값을 카드 형태로 표시하는 컴포넌트입니다. 라벨, 값, 단위를 포함합니다.

### Faceplate

디바이스의 상태를 표시하고 제어 명령을 실행할 수 있는 인터페이스입니다.

### SafeCommandButton

안전한 제어를 위해 확인 모달을 표시하는 버튼 컴포넌트입니다.

### AlarmBanner & AlarmList

알람 시스템을 관리하는 컴포넌트들로, Critical 알람은 배너로, 모든 알람은 리스트로 표시합니다.

## 데이터 모델

### TagValue

```typescript
interface TagValue {
  id: TagId;
  label: string;
  unit?: string;
  value: number;
  ts: number;
  quality: Quality;
}
```

### Alarm

```typescript
interface Alarm {
  id: string;
  tagId: TagId;
  message: string;
  severity: Severity;
  active: boolean;
  acknowledged: boolean;
  ts: number;
}
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
