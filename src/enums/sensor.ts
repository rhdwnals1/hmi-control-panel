/**
 * 센서 관련 열거형
 */
export const SensorType = {
  DO: "DO",
  TEMP: "TEMP",
  PH: "PH",
  SAL: "SAL",
} as const;

export const SensorUnit = {
  DO: "mg/L",
  TEMP: "°C",
  PH: "pH",
  SAL: "ppt",
} as const;

export const SensorQuality = {
  GOOD: "GOOD",
  UNCERTAIN: "UNCERTAIN",
  BAD: "BAD",
} as const;

export const AlarmSeverity = {
  CRIT: "CRIT",
  MAJ: "MAJ",
  MIN: "MIN",
  INFO: "INFO",
} as const;

export const AlarmStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ACKNOWLEDGED: "acknowledged",
} as const;
