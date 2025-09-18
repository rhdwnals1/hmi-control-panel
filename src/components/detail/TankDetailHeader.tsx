import React from "react";
import { useNavigate } from "react-router-dom";

interface TankDetailHeaderProps {
  tankId: string | undefined;
  criticalsCount: number;
}

export const TankDetailHeader: React.FC<TankDetailHeaderProps> = ({
  tankId,
  criticalsCount,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white p-6 rounded-3xl shadow-2xl shadow-sky-200/25">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tanks")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {tankId}-HMI
              </h1>
              <p className="text-cyan-100 text-sm mt-1">
                마지막 업데이트: {new Date().toLocaleTimeString()} · 현재:
                Online
              </p>
            </div>
          </div>
          <p className="text-cyan-100 text-sm">단위: mg/L, °C, pH, ppt</p>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalsCount > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl shadow-xl shadow-red-200/25">
          <div className="flex items-center gap-2">
            <span className="text-red-100">⚠️</span>
            <span className="font-semibold text-white">
              Critical {criticalsCount} — 즉시 확인 필요
            </span>
          </div>
        </div>
      )}
    </>
  );
};
