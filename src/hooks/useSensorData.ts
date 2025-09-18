import { useState, useEffect } from "react";
import { getAllTankIds } from "@/lib/tank-utils";

export const useSensorData = () => {
  const [sensorValues, setSensorValues] = useState<
    Record<string, { value: number }>
  >({});

  // Mock sensor data generation - 더 자주 크리티컬 값 생성
  useEffect(() => {
    const generateSensorData = () => {
      const newValues: Record<string, { value: number }> = {};
      getAllTankIds().forEach((tankId) => {
        // 10% 확률로 크리티컬 값 생성 (1-2개 정도)
        const isCritical = Math.random() < 0.1;

        if (isCritical) {
          // 크리티컬 값들 생성
          newValues[`${tankId}.DO`] = { value: 4.0 + Math.random() * 1.5 }; // 4.0-5.5 (크리티컬)
          newValues[`${tankId}.TEMP`] = {
            value:
              Math.random() < 0.5
                ? 10 + Math.random() * 2
                : 19 + Math.random() * 3,
          }; // 10-12 또는 19-22
          newValues[`${tankId}.PH`] = {
            value:
              Math.random() < 0.5
                ? 6.5 + Math.random() * 0.5
                : 8.0 + Math.random() * 0.5,
          }; // 6.5-7.0 또는 8.0-8.5
          newValues[`${tankId}.SAL`] = {
            value:
              Math.random() < 0.5
                ? 28 + Math.random() * 2
                : 38 + Math.random() * 2,
          }; // 28-30 또는 38-40
        } else {
          // 정상 값들 생성
          newValues[`${tankId}.DO`] = { value: 6.0 + Math.random() * 2 };
          newValues[`${tankId}.TEMP`] = { value: 14.0 + Math.random() * 4 };
          newValues[`${tankId}.PH`] = { value: 7.2 + Math.random() * 0.6 };
          newValues[`${tankId}.SAL`] = { value: 32.0 + Math.random() * 4 };
        }
      });
      setSensorValues(newValues);
    };

    generateSensorData();
    const interval = setInterval(generateSensorData, 2000); // 2초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  return { sensorValues };
};
