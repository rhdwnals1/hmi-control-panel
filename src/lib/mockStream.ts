import { useEffect, useState } from "react";
import type { Alarm, Severity, TagId, TagValue } from "../types";

export function useMockLiveStream(tagIds: TagId[]) {
  const [values, setValues] = useState<Record<string, TagValue>>({});
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const next: Record<string, TagValue> = { ...values };

      tagIds.forEach((id) => {
        const base = id.includes("DO")
          ? 6
          : id.includes("TEMP")
          ? 22
          : id.includes("PH")
          ? 7.6
          : id.includes("SAL")
          ? 30
          : 1;
        const jitter =
          (Math.random() - 0.5) * (id.includes("TEMP") ? 0.3 : 0.2);
        const val = (next[id]?.value ?? base) + jitter;
        next[id] = {
          id,
          label: id,
          unit: id.includes("TEMP")
            ? "°C"
            : id.includes("DO")
            ? "mg/L"
            : id.includes("PH")
            ? "pH"
            : id.includes("SAL")
            ? "ppt"
            : "",
          value: Number(val.toFixed(id.includes("PH") ? 2 : 1)),
          ts: now,
          quality: Math.random() < 0.98 ? "GOOD" : "UNCERTAIN",
        };
      });

      // DO 알람 레벨
      const doTag = next["TANK1.DO"];
      if (doTag) {
        const severity: Severity | null =
          doTag.value < 3.5
            ? "CRIT"
            : doTag.value < 4.5
            ? "MAJ"
            : doTag.value < 5.0
            ? "MIN"
            : null;
        const existingActive = alarms.find(
          (a) => a.tagId === "TANK1.DO" && a.active
        );
        if (severity && !existingActive) {
          setAlarms((prev) => [
            {
              id: `ALM-${now}`,
              tagId: "TANK1.DO",
              message: `Low DO (${doTag.value} mg/L)`,
              severity,
              active: true,
              acknowledged: false,
              ts: now,
            },
            ...prev,
          ]);
        }
        if (!severity && existingActive) {
          setAlarms((prev) =>
            prev.map((a) =>
              a.id === existingActive.id ? { ...a, active: false } : a
            )
          );
        }
      }

      setValues(next);
    }, 1000);
    return () => clearInterval(timer);
  }, [tagIds]);

  const ack = (id: string) =>
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );

  return { values, alarms, ack } as const;
}
