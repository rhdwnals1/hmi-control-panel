import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OverviewHeader } from "@/components/overview/OverviewHeader";
import { TankGrid } from "@/components/overview/TankGrid";
import { useSensorData } from "@/hooks/useSensorData";
import { useCriticalAlarms } from "@/hooks/useCriticalAlarms";
import { useAlarmSound } from "@/hooks/useAlarmSound";

export default function TanksOverview() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);

  // Custom hooks for data management
  const { sensorValues } = useSensorData();
  const { criticalTanks } = useCriticalAlarms({ sensorValues });

  // Play alarm sound
  useAlarmSound({
    shouldPlay: criticalTanks.length > 0,
    type: "critical",
    isMuted,
  });

  const handleTankClick = (tankId: string) => {
    navigate(`/tanks/${tankId}`);
  };

  const handleCriticalTankClick = (tankId: string) => {
    window.open(`/tanks/${tankId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <OverviewHeader
          criticalTanks={criticalTanks}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted(!isMuted)}
          onCriticalTankClick={handleCriticalTankClick}
        />

        <TankGrid sensorValues={sensorValues} onTankClick={handleTankClick} />
      </div>
    </div>
  );
}
