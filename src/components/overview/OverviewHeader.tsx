import React from "react";

interface OverviewHeaderProps {
  criticalTanks: string[];
  isMuted: boolean;
  onMuteToggle: () => void;
  onCriticalTankClick: (tankId: string) => void;
}

export const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  criticalTanks,
  isMuted,
  onMuteToggle,
  onCriticalTankClick,
}) => {
  return (
    <div
      className={`p-6 rounded-3xl shadow-2xl transition-all duration-500 ${
        criticalTanks.length > 0
          ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-red-200/25"
          : "bg-gradient-to-r from-sky-600 to-cyan-500 shadow-sky-200/25"
      } text-white`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            수조 모니터링
          </h1>
          <p
            className={`text-sm mt-1 ${
              criticalTanks.length > 0 ? "text-red-100" : "text-cyan-100"
            }`}
          >
            마지막 업데이트: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Critical Alert Center */}
        {criticalTanks.length > 0 && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm">
              <span className="text-2xl animate-bounce">⚠️</span>
              <div className="text-center">
                <div className="text-lg font-bold">Critical 알람 발생</div>
                <div className="text-sm opacity-90">즉시 확인 필요</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {criticalTanks.map((tankId) => (
                  <button
                    key={tankId}
                    onClick={() => onCriticalTankClick(tankId)}
                    className="text-xs bg-white/30 hover:bg-white/40 px-3 py-1 rounded-md transition-all duration-200 font-semibold border border-white/40 hover:border-white/60"
                  >
                    {tankId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onMuteToggle}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span className="text-lg">{isMuted ? "🔇" : "🔊"}</span>
          </button>
          <p
            className={`text-sm ${
              criticalTanks.length > 0 ? "text-red-100" : "text-cyan-100"
            }`}
          >
            단위: mg/L, °C, pH, ppt
          </p>
        </div>
      </div>
    </div>
  );
};
