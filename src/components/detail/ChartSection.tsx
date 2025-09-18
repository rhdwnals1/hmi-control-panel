import React, { useState } from "react";
import { MultiLineChart } from "@/components/charts/MultiLineChart";

interface ChartSectionProps {
  chartData: Array<{
    time: number;
    DO?: number;
    TEMP?: number;
    PH?: number;
    SAL?: number;
  }>;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ chartData }) => {
  const [visibleSeries, setVisibleSeries] = useState({
    DO: true,
    TEMP: true,
    PH: false,
    SAL: false,
  });
  const [timeRange, setTimeRange] = useState(60 * 60); // 기본 1시간
  const [customHours, setCustomHours] = useState(6);

  return (
    <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-800">
            Live Trend — 선택 시리즈
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange(30 * 60)}
              className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                timeRange === 30 * 60
                  ? "bg-blue-500 text-white"
                  : "bg-white/70 text-slate-600 hover:bg-white/80"
              }`}
            >
              30분
            </button>
            <button
              onClick={() => setTimeRange(60 * 60)}
              className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                timeRange === 60 * 60
                  ? "bg-blue-500 text-white"
                  : "bg-white/70 text-slate-600 hover:bg-white/80"
              }`}
            >
              1시간
            </button>
            <button
              onClick={() => setTimeRange(24 * 60 * 60)}
              className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                timeRange === 24 * 60 * 60
                  ? "bg-blue-500 text-white"
                  : "bg-white/70 text-slate-600 hover:bg-white/80"
              }`}
            >
              24시간
            </button>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="시간"
                value={customHours}
                onChange={(e) => setCustomHours(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="1"
                max="168"
              />
              <button
                onClick={() => setTimeRange(customHours * 60 * 60)}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(visibleSeries).map(([key, isVisible]) => (
            <label
              key={key}
              className={`inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl cursor-pointer select-none border transition-all duration-200 ${
                isVisible
                  ? "bg-white/90 border-sky-200 text-slate-800 shadow-sm"
                  : "bg-white/70 border-slate-200 text-slate-600 hover:bg-white/80"
              }`}
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() =>
                  setVisibleSeries((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className="sr-only"
              />
              {key}
            </label>
          ))}
        </div>
      </div>
      <div className="h-[500px] w-full">
        <MultiLineChart
          data={chartData}
          visibleSeries={visibleSeries}
          height={500}
          timeRange={timeRange}
        />
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 mt-4 px-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#3b82f6" }}
          />
          <span className="text-sm text-gray-600">DO (용존산소)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#10b981" }}
          />
          <span className="text-sm text-gray-600">TEMP (수온)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#f59e0b" }}
          />
          <span className="text-sm text-gray-600">PH (산성도)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          <span className="text-sm text-gray-600">SAL (염도)</span>
        </div>
      </div>
    </div>
  );
};
