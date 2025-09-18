import React from "react";

export const AlarmLog: React.FC = () => {
  return (
    <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">알림 로그</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            전체
          </button>
          <button className="px-3 py-1 text-xs bg-white/70 text-slate-600 rounded hover:bg-white/80 transition-colors">
            경고
          </button>
          <button className="px-3 py-1 text-xs bg-white/70 text-slate-600 rounded hover:bg-white/80 transition-colors">
            위험
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {/* Mock alarm logs */}
        <div className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-700">위험</span>
              <span className="text-xs text-slate-500">
                2024-01-15 14:32:15
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              DO 수치가 5.2mg/L 이하로 떨어졌습니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-yellow-700">
                경고
              </span>
              <span className="text-xs text-slate-500">
                2024-01-15 14:28:42
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              수온이 18°C를 초과했습니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-700">정보</span>
              <span className="text-xs text-slate-500">
                2024-01-15 14:25:18
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              산소공급기가 정상 작동을 시작했습니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-700">위험</span>
              <span className="text-xs text-slate-500">
                2024-01-15 14:20:33
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              pH 수치가 6.8 이하로 떨어졌습니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-yellow-700">
                경고
              </span>
              <span className="text-xs text-slate-500">
                2024-01-15 14:15:07
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              염도가 37ppt를 초과했습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
