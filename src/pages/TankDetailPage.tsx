import { useParams } from "react-router-dom";
import { TankDetailHeader } from "@/components/detail/TankDetailHeader";
import { SensorGauges } from "@/components/detail/SensorGauges";
import { ChartSection } from "@/components/detail/ChartSection";
import { AlarmLog } from "@/components/detail/AlarmLog";
import { ControlPanels } from "@/components/detail/ControlPanels";
import { useTankDetailData } from "@/hooks/useTankDetailData";
import { ALARM_THRESHOLDS } from "@/lib/constants";

export default function TankDetailPage() {
  const { tankId } = useParams<{ tankId: string }>();

  // Custom hook for data management
  const { sensorValues, chartData } = useTankDetailData();

  const criticals = Object.entries(sensorValues).filter(([key, value]) => {
    const threshold = ALARM_THRESHOLDS[key as keyof typeof ALARM_THRESHOLDS];
    return value < threshold.min || value > threshold.max;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <TankDetailHeader tankId={tankId} criticalsCount={criticals.length} />
        <SensorGauges sensorValues={sensorValues} />
        <ChartSection chartData={chartData} />
        <AlarmLog />
        <ControlPanels sensorValues={sensorValues} />
      </div>
    </div>
  );
}
