import {
  TANK_IDS,
  SENSOR_KEYS,
  SENSOR_DECIMALS,
  SENSOR_UNITS,
  type SensorKey,
} from "../constants";

/**
 * 특정 탱크의 모든 센서 태그 ID를 생성합니다.
 */
export const getTagsForTank = (tankId: string): string[] => {
  return SENSOR_KEYS.map((sensor) => `${tankId}.${sensor}`);
};

/**
 * 센서 값을 포맷팅합니다.
 */
export const formatSensorValue = (
  sensor: SensorKey,
  value?: number
): string => {
  if (typeof value !== "number") return "—";
  return value.toFixed(SENSOR_DECIMALS[sensor as keyof typeof SENSOR_DECIMALS]);
};

/**
 * 센서 단위를 가져옵니다.
 */
export const getSensorUnit = (sensor: SensorKey): string => {
  return SENSOR_UNITS[sensor as keyof typeof SENSOR_UNITS];
};

/**
 * 탱크 ID에서 번호를 추출합니다.
 */
export const getTankNumber = (tankId: string): number => {
  return parseInt(tankId.replace("TANK", ""), 10);
};

/**
 * 모든 탱크 ID를 가져옵니다.
 */
export const getAllTankIds = (): string[] => {
  return [...TANK_IDS];
};
