// 기본 타입 정의
export interface TagValue {
  id: string;
  label: string;
  value: number;
  unit?: string;
  ts: number;
  quality: "GOOD" | "UNCERTAIN" | "BAD";
}

export interface Alarm {
  id: string;
  tagId: string;
  severity: "CRIT" | "MAJ" | "MIN" | "INFO";
  message: string;
  active: boolean;
  timestamp: number;
}

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

export interface AlarmBannerProps {
  className?: string;
}

// 센서 관련 타입
export type SensorKey = "DO" | "TEMP" | "PH" | "SAL";

export interface SensorThresholds {
  crit: number | { min: number; max: number };
  maj: number | { min: number; max: number };
  min: number | { min: number; max: number };
}

// 스토어 타입
export interface LiveStore {
  tags: Record<string, TagValue>;
  alarms: Alarm[];
  setTags: (patch: Record<string, TagValue>) => void;
  setAlarms: (alarms: Alarm[]) => void;
}

// 컴포넌트 Props 타입
export interface TankCardProps {
  tankId: string;
  status?: TankStatus;
  onOpen: () => void;
}

// 스타일 관련 타입
export interface StyledProps {
  $hasAlarm?: boolean;
  $criticalCount?: number;
  $severity?: "critical" | "major" | "minor";
}
