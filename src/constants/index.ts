// 탱크 관련 상수
export const TANK_COUNT = 18;
export const TANK_IDS = Array.from(
  { length: TANK_COUNT },
  (_, i) => `TANK${i + 1}`
);

// 센서 관련 상수
export const SENSOR_KEYS = ["DO", "TEMP", "PH", "SAL"] as const;
export type SensorKey = (typeof SENSOR_KEYS)[number];

// 센서별 색상
export const SENSOR_COLORS = {
  DO: "#0ea5e9",
  TEMP: "#10b981",
  PH: "#6366f1",
  SAL: "#f59e0b",
} as const;

// 센서별 소수점 자리수
export const SENSOR_DECIMALS = {
  DO: 2,
  TEMP: 1,
  PH: 2,
  SAL: 2,
} as const;

// 센서별 단위
export const SENSOR_UNITS = {
  DO: "mg/L",
  TEMP: "°C",
  PH: "pH",
  SAL: "ppt",
} as const;

// 알람 임계값
export const ALARM_THRESHOLDS = {
  DO: { crit: 5.0, maj: 5.5, min: 6.0 },
  TEMP: {
    crit: { min: 10.0, max: 20.0 },
    maj: { min: 12.0, max: 18.0 },
    min: { min: 13.0, max: 17.0 },
  },
  PH: {
    crit: { min: 6.8, max: 8.2 },
    maj: { min: 7.0, max: 8.0 },
    min: { min: 7.2, max: 7.8 },
  },
  SAL: {
    crit: { min: 25, max: 35 },
    maj: { min: 27, max: 33 },
    min: { min: 28, max: 32 },
  },
} as const;

// 기본 센서 값
export const DEFAULT_SENSOR_VALUES = {
  DO: 6,
  TEMP: 15,
  PH: 7.5,
  SAL: 30,
} as const;

// 알람 주기 (밀리초)
export const ALARM_CYCLES = {
  CRITICAL: 30000, // 30초
  MAJOR: 180000, // 3분
} as const;

// 사운드 파일 경로
export const SOUND_FILES = {
  critical: "/sounds/critical-alarm.mp3",
  major: "/sounds/major-alarm.mp3",
  minor: "/sounds/minor-alarm.mp3",
} as const;

// UI 상수
export const UI_CONSTANTS = {
  SPARKLINE_POINTS: 60,
  ALARM_REPEAT_INTERVAL: 3000,
  AUDIO_VOLUME: 0.7,
  TANK_STATUS_UPDATE_INTERVAL: 5000,
} as const;
