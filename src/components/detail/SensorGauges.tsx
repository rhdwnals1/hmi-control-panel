import React from "react";
import { CircularGauge } from "@/components/ui/circular-gauge";
import { SENSOR_COLORS } from "@/lib/constants";

interface SensorGaugesProps {
  sensorValues: {
    DO: number;
    TEMP: number;
    PH: number;
    SAL: number;
  };
}

export const SensorGauges: React.FC<SensorGaugesProps> = ({ sensorValues }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <CircularGauge
            value={sensorValues.DO}
            max={10}
            color={SENSOR_COLORS.DO}
            size={120}
          />
          <p className="text-sm text-slate-600 mt-4 font-medium">용존산소</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            목표 5.5~8.0mg/L
          </p>
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <CircularGauge
            value={sensorValues.TEMP}
            max={25}
            color={SENSOR_COLORS.TEMP}
            size={120}
          />
          <p className="text-sm text-slate-600 mt-4 font-medium">수온</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            목표 12~18°C
          </p>
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <CircularGauge
            value={sensorValues.PH}
            max={10}
            color={SENSOR_COLORS.PH}
            size={120}
          />
          <p className="text-sm text-slate-600 mt-4 font-medium">pH</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            목표 6.8~8.2pH
          </p>
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <CircularGauge
            value={sensorValues.SAL}
            max={40}
            color={SENSOR_COLORS.SAL}
            size={120}
          />
          <p className="text-sm text-slate-600 mt-4 font-medium">염도</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            목표 28~37ppt
          </p>
        </div>
      </div>
    </div>
  );
};
