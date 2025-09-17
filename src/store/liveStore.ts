
import { create } from "zustand";
import type { TagValue, Alarm } from "../types";

interface LiveStoreState {
  tags: Record<string, TagValue>;
  setTags: (patch: Record<string, TagValue>) => void;
  alarms: Alarm[];
  setAlarms: (list: Alarm[]) => void;
  ackAlarm: (id: string) => void;
}

export const useLiveStore = create<LiveStoreState>((set) => ({
  tags: {},
  setTags: (patch) => set((s) => ({ tags: { ...s.tags, ...patch } })),
  alarms: [],
  setAlarms: (list) => set({ alarms: list }),
  ackAlarm: (id) => set((s) => ({ alarms: s.alarms.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)) })),
}));
