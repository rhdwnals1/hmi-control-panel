import React from "react";
import { TankCard } from "@/components/tank/TankCard";
import { getAllTankIds } from "@/lib/tank-utils";

interface TankGridProps {
  sensorValues: Record<string, { value: number }>;
  onTankClick: (tankId: string) => void;
}

export const TankGrid: React.FC<TankGridProps> = ({
  sensorValues,
  onTankClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {getAllTankIds().map((tankId) => {
        const doValue = sensorValues[`${tankId}.DO`]?.value;
        const tempValue = sensorValues[`${tankId}.TEMP`]?.value;
        const phValue = sensorValues[`${tankId}.PH`]?.value;
        const salValue = sensorValues[`${tankId}.SAL`]?.value;

        const hasAlarm = Boolean(
          (doValue && doValue < 5.5) ||
            (tempValue && (tempValue < 12 || tempValue > 20)) ||
            (phValue && (phValue < 7.0 || phValue > 8.0)) ||
            (salValue && (salValue < 30 || salValue > 38))
        );
        const criticalCount = hasAlarm ? 1 : 0;

        return (
          <TankCard
            key={tankId}
            tankId={tankId}
            sensorValues={{
              DO: sensorValues[`${tankId}.DO`]?.value,
              TEMP: sensorValues[`${tankId}.TEMP`]?.value,
              PH: sensorValues[`${tankId}.PH`]?.value,
              SAL: sensorValues[`${tankId}.SAL`]?.value,
            }}
            hasAlarm={hasAlarm}
            criticalCount={criticalCount}
            onOpen={() => onTankClick(tankId)}
          />
        );
      })}
    </div>
  );
};
