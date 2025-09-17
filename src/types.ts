export type Severity = "CRIT" | "MAJ" | "MIN" | "INFO";
export type Quality = "GOOD" | "BAD" | "UNCERTAIN";
export type TagId = string;

export interface TagValue {
  id: TagId;
  label: string;
  unit?: string;
  value: number;
  ts: number;
  quality: Quality;
}

export interface Alarm {
  id: string;
  tagId: TagId;
  message: string;
  severity: Severity;
  active: boolean;
  acknowledged: boolean;
  ts: number;
}

export interface Command {
  name: "START" | "STOP" | "RESET";
}
