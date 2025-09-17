export const TANK_COUNT = 18;
export const tankIds = Array.from(
  { length: TANK_COUNT },
  (_, i) => `TANK${i + 1}`
);

export const sensorKeys = ["DO", "TEMP", "PH", "SAL"] as const;
export type SensorKey = (typeof sensorKeys)[number];

export const tagsForTank = (tankId: string) =>
  sensorKeys.map((k) => `${tankId}.${k}` as const);

export const SERIES_COLOR = {
  DO: "#0ea5e9",
  TEMP: "#10b981",
  PH: "#6366f1",
  SAL: "#f59e0b",
} as const;

export const DEC = {
  DO: 2,
  TEMP: 1,
  PH: 2,
  SAL: 2,
} as const;

export function formatValue(k: keyof typeof DEC, v?: number) {
  return typeof v === "number" ? v.toFixed(DEC[k]) : "—";
}
