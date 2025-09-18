export const SENSOR_COLORS = {
  DO: "#3b82f6",
  TEMP: "#10b981",
  PH: "#f59e0b",
  SAL: "#8b5cf6",
} as const;

export const ALARM_THRESHOLDS = {
  DO: { min: 4, max: 10 },
  TEMP: { min: 10, max: 18 },
  PH: { min: 6.8, max: 8.2 },
  SAL: { min: 28, max: 37 },
} as const;

export const TANK_IDS = Array.from({ length: 15 }, (_, i) => `TANK${i + 1}`);
