import React from "react";

interface ControlPanelsProps {
  sensorValues: {
    DO: number;
    TEMP: number;
    PH: number;
    SAL: number;
  };
}

export const ControlPanels: React.FC<ControlPanelsProps> = ({
  sensorValues,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">
              산소공급기
            </h3>
            <p className="text-sm text-slate-600">
              상태: {sensorValues.DO < 5.2 ? "RUN" : "STOP"}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
              STOP
            </button>
            <button className="px-3 py-2 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
              RESET
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">펌프</h3>
            <p className="text-sm text-slate-600">
              상태: {sensorValues.DO < 6.5 ? "RUN" : "STOP"}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
              STOP
            </button>
            <button className="px-3 py-2 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
