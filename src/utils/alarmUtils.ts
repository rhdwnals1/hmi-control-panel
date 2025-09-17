import { ALARM_THRESHOLDS, SENSOR_KEYS, type SensorKey } from "../constants";
import type { TagValue } from "../types";

export interface TankStatus {
  tankId: string;
  hasAlarm: boolean;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  alarms: Array<{
    sensor: string;
    value: number;
    severity: "CRIT" | "MAJ" | "MIN";
    message: string;
  }>;
}

/**
 * 센서 값이 임계값을 벗어났는지 확인합니다.
 */
const checkThreshold = (
  value: number,
  threshold: number | { min: number; max: number }
): boolean => {
  if (typeof threshold === "number") {
    // DO의 경우: 값이 임계값보다 작으면 알람
    return value < threshold;
  }
  // TEMP, PH, SAL의 경우: 범위를 벗어나면 알람
  return value < threshold.min || value > threshold.max;
};

/**
 * 센서별 알람 심각도를 확인합니다.
 */
const getAlarmSeverity = (sensor: SensorKey, value: number): string | null => {
  const thresholds = ALARM_THRESHOLDS[sensor as keyof typeof ALARM_THRESHOLDS];

  if (checkThreshold(value, thresholds.crit)) {
    return "CRIT";
  }
  if (checkThreshold(value, thresholds.maj)) {
    return "MAJ";
  }
  if (checkThreshold(value, thresholds.min)) {
    return "MIN";
  }

  return null;
};

/**
 * 탱크 상태를 체크합니다.
 */
export const checkTankStatus = (
  tankId: string,
  tags: Record<string, TagValue>
): TankStatus => {
  const alarms: TankStatus["alarms"] = [];
  let criticalCount = 0;
  let majorCount = 0;
  let minorCount = 0;

  // 각 센서별로 알람 체크
  SENSOR_KEYS.forEach((sensor: SensorKey) => {
    const tag = tags[`${tankId}.${sensor}`];
    if (!tag || typeof tag.value !== "number") return;

    const severity = getAlarmSeverity(sensor, tag.value);
    if (!severity) return;

    const message = `${
      severity === "CRIT" ? "Critical" : severity === "MAJ" ? "Major" : "Minor"
    } ${sensor} (${tag.value.toFixed(2)})`;

    alarms.push({
      sensor,
      value: tag.value,
      severity: severity as "CRIT" | "MAJ" | "MIN",
      message,
    });

    if (severity === "CRIT") criticalCount++;
    else if (severity === "MAJ") majorCount++;
    else if (severity === "MIN") minorCount++;
  });

  return {
    tankId,
    hasAlarm: criticalCount > 0 || majorCount > 0 || minorCount > 0,
    criticalCount,
    majorCount,
    minorCount,
    alarms,
  };
};

/**
 * Critical 알람이 있는 탱크들을 필터링합니다.
 */
export const getCriticalTanks = (tankStatuses: TankStatus[]): TankStatus[] => {
  return tankStatuses.filter((status) => status.criticalCount > 0);
};

/**
 * 알람 상세 정보를 가져옵니다.
 */
export const getAlarmDetails = (status: TankStatus): string[] => {
  const details: string[] = [];

  const criticalAlarms = status.alarms.filter(
    (alarm: TankStatus["alarms"][0]) => alarm.severity === "CRIT"
  );

  criticalAlarms.forEach((alarm: TankStatus["alarms"][0]) => {
    const { sensor, value } = alarm;
    const unit = getSensorUnit(sensor);

    let condition = "";
    if (sensor === "DO" && value < 5.0) condition = "(낮음)";
    else if (sensor === "TEMP") {
      condition = value < 10.0 ? "(낮음)" : value > 20.0 ? "(높음)" : "";
    } else if (sensor === "PH") {
      condition = value < 6.8 ? "(낮음)" : value > 8.2 ? "(높음)" : "";
    } else if (sensor === "SAL") {
      condition = value < 25 ? "(낮음)" : value > 35 ? "(높음)" : "";
    }

    details.push(`${sensor} ${value.toFixed(2)}${unit} ${condition}`);
  });

  return details;
};

// getSensorUnit 함수 (임시로 여기에 정의)
const getSensorUnit = (sensor: string): string => {
  const units: Record<string, string> = {
    DO: "mg/L",
    TEMP: "°C",
    PH: "pH",
    SAL: "ppt",
  };
  return units[sensor] || "";
};
