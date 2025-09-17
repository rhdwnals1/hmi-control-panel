import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLiveStore } from "../store/liveStore";
import { useLightVisible, useLightStream } from "../hooks/useLightStream";
import {
  getTagsForTank,
  formatSensorValue,
  getSensorUnit,
} from "../utils/tankUtils";
interface TankCardProps {
  tankId: string;
  status?: {
    tankId: string;
    hasAlarm: boolean;
    criticalCount: number;
    majorCount: number;
    minorCount: number;
    alarms: Array<{
      sensor: string;
      value: number;
      severity: "CRIT" | "MAJ" | "MIN";
      message: string;
    }>;
  };
  onOpen: () => void;
}

/**
 * 탱크 카드 컴포넌트
 */
export const TankCard = ({ tankId, status, onOpen }: TankCardProps) => {
  const navigate = useNavigate();
  const tags = useLiveStore((state) => state.tags);
  const tagIds = useMemo(() => getTagsForTank(tankId), [tankId]);
  const ioRef = useLightVisible(tagIds);

  // 데이터 스트림 강제 시작
  useLightStream({ tagIds, visible: true });

  // 센서 값들
  const sensorValues = {
    DO: tags[`${tankId}.DO`]?.value,
    TEMP: tags[`${tankId}.TEMP`]?.value,
    PH: tags[`${tankId}.PH`]?.value,
    SAL: tags[`${tankId}.SAL`]?.value,
  };

  const handleClick = () => {
    navigate(`/tanks/${tankId}`);
    onOpen();
  };

  const hasCriticalAlarm = status?.criticalCount && status.criticalCount > 0;

  return (
    <Card
      ref={ioRef}
      onClick={handleClick}
      $hasAlarm={status?.hasAlarm}
      $criticalCount={status?.criticalCount || 0}
    >
      <HeaderRow>
        <TankName>{tankId}</TankName>
        {hasCriticalAlarm ? (
          <CriticalAlert>
            <CriticalIcon>⚠️</CriticalIcon>
            <CriticalText>CRITICAL ALERT</CriticalText>
          </CriticalAlert>
        ) : (
          <StatusBadge
            $isGood={
              typeof sensorValues.DO === "number" && sensorValues.DO >= 6
            }
          >
            DO {formatSensorValue("DO", sensorValues.DO)} {getSensorUnit("DO")}
          </StatusBadge>
        )}
      </HeaderRow>

      <KPIGrid>
        <KPICard>
          <KPILabel>Temp</KPILabel>
          <KPIValue>
            {formatSensorValue("TEMP", sensorValues.TEMP)}
            <KPIUnit>{getSensorUnit("TEMP")}</KPIUnit>
          </KPIValue>
        </KPICard>
        <KPICard>
          <KPILabel>pH</KPILabel>
          <KPIValue>
            {formatSensorValue("PH", sensorValues.PH)}
            <KPIUnit>{getSensorUnit("PH")}</KPIUnit>
          </KPIValue>
        </KPICard>
        <KPICard>
          <KPILabel>Sal</KPILabel>
          <KPIValue>
            {formatSensorValue("SAL", sensorValues.SAL)}
            <KPIUnit>{getSensorUnit("SAL")}</KPIUnit>
          </KPIValue>
        </KPICard>
      </KPIGrid>
    </Card>
  );
};

// 스타일 컴포넌트들
const Card = styled.div<{ $hasAlarm?: boolean; $criticalCount?: number }>`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 10px rgba(2, 6, 23, 0.04);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  width: 280px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(p) =>
    p.$hasAlarm &&
    `
    border-color: #f97316;
    background: #fff7ed;
  `}

  ${(p) =>
    p.$criticalCount &&
    p.$criticalCount > 0 &&
    `
    border-color: #dc2626;
    background: #fef2f2;
    animation: criticalBorderBlink 1s infinite;
  `}

  @keyframes criticalBorderBlink {
    0%,
    100% {
      border-color: #dc2626;
    }
    50% {
      border-color: #ef4444;
    }
  }

  &:focus {
    box-shadow: 0 0 0 2px #93c5fd inset;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TankName = styled.div`
  font-weight: 800;
`;

const StatusBadge = styled.div<{ $isGood: boolean }>`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  color: ${({ $isGood }) => ($isGood ? "#065f46" : "#7c2d12")};
  background: ${({ $isGood }) => ($isGood ? "#d1fae5" : "#ffedd5")};
  border: 1px solid ${({ $isGood }) => ($isGood ? "#10b981" : "#fb923c")};
`;

const CriticalAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dc2626;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  animation: criticalPulse 1s infinite;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);

  @keyframes criticalPulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
    }
  }
`;

const CriticalIcon = styled.div`
  font-size: 14px;
  animation: criticalBlink 0.5s infinite;

  @keyframes criticalBlink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0.3;
    }
  }
`;

const CriticalText = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const KPICard = styled.div`
  /* renamed from KPI to KPICard to avoid conflict */
`;

const KPILabel = styled.div`
  font-size: 11px;
  color: #64748b;
`;

const KPIValue = styled.div`
  font-weight: 800;
`;

const KPIUnit = styled.span`
  font-weight: 400;
  color: #64748b;
  margin-left: 4px;
`;
