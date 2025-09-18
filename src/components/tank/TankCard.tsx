import { useNavigate } from "react-router-dom";

interface TankCardProps {
  tankId: string;
  sensorValues?: {
    DO?: number;
    TEMP?: number;
    PH?: number;
    SAL?: number;
  };
  hasAlarm?: boolean;
  criticalCount?: number;
  onOpen: () => void;
}

/**
 * 탱크 카드 컴포넌트
 */
export const TankCard = ({
  tankId,
  sensorValues = {},
  hasAlarm = false,
  criticalCount = 0,
  onOpen,
}: TankCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tanks/${tankId}`);
    onOpen();
  };

  const hasCriticalAlarm = criticalCount > 0;
  const isGoodDO = typeof sensorValues.DO === "number" && sensorValues.DO >= 6;

  const formatValue = (value: number | undefined, decimals: number = 1) => {
    if (typeof value !== "number") return "--";
    return value.toFixed(decimals);
  };

  const getUnit = (sensor: string) => {
    switch (sensor) {
      case "DO":
        return "mg/L";
      case "TEMP":
        return "°C";
      case "PH":
        return "pH";
      case "SAL":
        return "ppt";
      default:
        return "";
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white border rounded-2xl p-3 cursor-pointer outline-none transition-all duration-200 w-72 h-36 flex flex-col justify-between
        ${
          hasAlarm
            ? "border-orange-400 bg-orange-50"
            : "border-slate-200 shadow-sm hover:shadow-md"
        }
        ${hasCriticalAlarm ? "border-red-500 bg-red-50 animate-pulse" : ""}
        focus:ring-2 focus:ring-blue-300
      `}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="font-extrabold text-slate-800">{tankId}</div>
        {hasCriticalAlarm ? (
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs animate-pulse shadow-lg shadow-red-200/50">
            <span className="text-sm animate-bounce">⚠️</span>
            <span className="text-xs font-extrabold tracking-wide">
              CRITICAL ALERT
            </span>
          </div>
        ) : (
          <div
            className={`
            text-xs px-2 py-1 rounded-full font-semibold
            ${
              isGoodDO
                ? "text-emerald-800 bg-emerald-100 border border-emerald-300"
                : "text-orange-800 bg-orange-100 border border-orange-300"
            }
          `}
          >
            DO {formatValue(sensorValues.DO)} {getUnit("DO")}
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-xs text-slate-500">Temp</div>
          <div className="font-extrabold text-slate-800">
            {formatValue(sensorValues.TEMP)}
            <span className="font-normal text-slate-500 ml-1">
              {getUnit("TEMP")}
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">pH</div>
          <div className="font-extrabold text-slate-800">
            {formatValue(sensorValues.PH, 2)}
            <span className="font-normal text-slate-500 ml-1">
              {getUnit("PH")}
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Sal</div>
          <div className="font-extrabold text-slate-800">
            {formatValue(sensorValues.SAL)}
            <span className="font-normal text-slate-500 ml-1">
              {getUnit("SAL")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
