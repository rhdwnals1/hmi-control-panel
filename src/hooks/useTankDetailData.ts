import { useState, useEffect } from "react";

export const useTankDetailData = () => {
  const [sensorValues, setSensorValues] = useState({
    DO: 6.1,
    TEMP: 15.0,
    PH: 7.5,
    SAL: 35.0,
  });

  const [chartData, setChartData] = useState<
    Array<{
      time: number;
      DO?: number;
      TEMP?: number;
      PH?: number;
      SAL?: number;
    }>
  >([]);

  // Generate mock sensor data
  useEffect(() => {
    const generateData = () => {
      setSensorValues((prev) => {
        const newValues = {
          DO: prev.DO + (Math.random() - 0.5) * 0.2,
          TEMP: prev.TEMP + (Math.random() - 0.5) * 0.2,
          PH: prev.PH + (Math.random() - 0.5) * 0.02,
          SAL: prev.SAL + (Math.random() - 0.5) * 0.1,
        };

        // Update chart data with new values
        setChartData((chartPrev) => {
          const now = Date.now() / 1000;
          const newData = [...chartPrev.slice(-59)];
          const chartPoint = {
            time: now,
            DO: newValues.DO + (Math.random() - 0.5) * 0.2,
            TEMP: newValues.TEMP + (Math.random() - 0.5) * 0.2,
            PH: newValues.PH + (Math.random() - 0.5) * 0.02,
            SAL: newValues.SAL + (Math.random() - 0.5) * 0.1,
          };
          newData.push(chartPoint);
          console.log("New chart data point:", chartPoint);
          return newData;
        });

        return newValues;
      });
    };

    generateData();
    const interval = setInterval(generateData, 1000);
    return () => clearInterval(interval);
  }, []);

  return { sensorValues, chartData };
};
