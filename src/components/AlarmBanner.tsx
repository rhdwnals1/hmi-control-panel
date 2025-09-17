import styled from "styled-components";
import { useLiveStore } from "../store/liveStore";

interface AlarmBannerProps {
  className?: string;
}

/**
 * 알람 배너 컴포넌트
 */
export const AlarmBanner = ({ className }: AlarmBannerProps) => {
  const { alarms } = useLiveStore();

  const criticalAlarms = alarms.filter(
    (alarm) => alarm.active && alarm.severity === "CRIT"
  );
  const majorAlarms = alarms.filter(
    (alarm) => alarm.active && alarm.severity === "MAJ"
  );
  const minorAlarms = alarms.filter(
    (alarm) => alarm.active && alarm.severity === "MIN"
  );

  const totalAlarms =
    criticalAlarms.length + majorAlarms.length + minorAlarms.length;

  if (totalAlarms === 0) return null;

  const severity =
    criticalAlarms.length > 0
      ? "critical"
      : majorAlarms.length > 0
      ? "major"
      : "minor";

  return (
    <BannerContainer className={className} $severity={severity}>
      <BannerContent>
        <WarningIcon>⚠️</WarningIcon>
        <BannerText>
          {criticalAlarms.length > 0 && (
            <AlarmCount $color="#ffffff">
              Critical {criticalAlarms.length}개
            </AlarmCount>
          )}
          {criticalAlarms.length > 0 && majorAlarms.length > 0 && " | "}
          {majorAlarms.length > 0 && (
            <AlarmCount $color="#fef3c7">
              Major {majorAlarms.length}개
            </AlarmCount>
          )}
          {(criticalAlarms.length > 0 || majorAlarms.length > 0) &&
            minorAlarms.length > 0 &&
            " | "}
          {minorAlarms.length > 0 && (
            <AlarmCount $color="#d1fae5">
              Minor {minorAlarms.length}개
            </AlarmCount>
          )}
          <AlarmMessage>— 즉시 확인 필요</AlarmMessage>
        </BannerText>
      </BannerContent>
    </BannerContainer>
  );
};

// 스타일 컴포넌트들
const BannerContainer = styled.div<{
  $severity: "critical" | "major" | "minor";
}>`
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  background: ${({ $severity }) => {
    switch ($severity) {
      case "critical":
        return "linear-gradient(to right, #dc2626, #dc2626)";
      case "major":
        return "linear-gradient(to right, #ea580c, #ea580c)";
      case "minor":
        return "linear-gradient(to right, #d97706, #d97706)";
      default:
        return "#d97706";
    }
  }};
  color: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${({ $severity }) =>
      $severity === "critical" ? "criticalPulse" : "none"}
    2s infinite;

  @keyframes criticalPulse {
    0%,
    100% {
      box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3);
    }
    50% {
      box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.6);
    }
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WarningIcon = styled.span`
  font-size: 18px;
`;

const BannerText = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AlarmCount = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: 700;
`;

const AlarmMessage = styled.span`
  margin-left: 8px;
  opacity: 0.9;
  font-size: 14px;
`;
