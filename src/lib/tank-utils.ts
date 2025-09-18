export const formatSensorValue = (sensor: string, value?: number): string => {
  if (typeof value !== "number") return "—";

  const decimalsMap: Record<string, number> = {
    DO: 2,
    TEMP: 1,
    PH: 2,
    SAL: 1,
  };

  const decimals = decimalsMap[sensor] || 1;

  return value.toFixed(decimals);
};

export const getSensorUnit = (sensor: string): string => {
  const units = {
    DO: "mg/L",
    TEMP: "°C",
    PH: "pH",
    SAL: "ppt",
  };

  return units[sensor as keyof typeof units] || "";
};

export const getAllTankIds = (): string[] => {
  return Array.from({ length: 15 }, (_, i) => `TANK${i + 1}`);
};
