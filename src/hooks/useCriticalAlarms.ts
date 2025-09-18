import { useMemo } from "react";
import { getAllTankIds } from "@/lib/tank-utils";

interface UseCriticalAlarmsProps {
  sensorValues: Record<string, { value: number }>;
}

export const useCriticalAlarms = ({ sensorValues }: UseCriticalAlarmsProps) => {
  const criticalTanks = useMemo(() => {
    return getAllTankIds().filter((tankId) => {
      const doValue = sensorValues[`${tankId}.DO`]?.value;
      const tempValue = sensorValues[`${tankId}.TEMP`]?.value;
      const phValue = sensorValues[`${tankId}.PH`]?.value;
      const salValue = sensorValues[`${tankId}.SAL`]?.value;

      // 더 자주 크리티컬 알람이 발생하도록 조건 완화
      return (
        (doValue && doValue < 5.5) || // DO 5.5 미만
        (tempValue && (tempValue < 12 || tempValue > 20)) || // 온도 12도 미만 또는 20도 초과
        (phValue && (phValue < 7.0 || phValue > 8.0)) || // pH 7.0 미만 또는 8.0 초과
        (salValue && (salValue < 30 || salValue > 38)) // 염도 30 미만 또는 38 초과
      );
    });
  }, [sensorValues]);

  return { criticalTanks };
};
