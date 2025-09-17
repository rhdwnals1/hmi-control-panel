import styled from "styled-components";
import { useLiveStore } from "../store/liveStore";
import { timeAgo } from "../utils/time";

export default function AlarmList() {
  const { alarms, ackAlarm } = useLiveStore();
  return (
    <AlarmListContainer>
      {alarms.map((a) => (
        <AlarmItem key={a.id}>
          <SeverityPill $severity={a.severity}>{a.severity}</SeverityPill>
          <TagId>{a.tagId}</TagId>
          <Message>{a.message}</Message>
          <Timestamp>{timeAgo(a.ts)}</Timestamp>
          {!a.acknowledged && (
            <AckButton onClick={() => ackAlarm(a.id)}>ACK</AckButton>
          )}
        </AlarmItem>
      ))}
    </AlarmListContainer>
  );
}

const AlarmListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AlarmItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const SeverityPill = styled.span<{
  $severity: "CRIT" | "MAJ" | "MIN" | "INFO";
}>`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background: ${(props) => {
    switch (props.$severity) {
      case "CRIT":
        return "#dc2626";
      case "MAJ":
        return "#f97316";
      case "MIN":
        return "#f59e0b";
      case "INFO":
        return "#0ea5e9";
      default:
        return "#6b7280";
    }
  }};
  color: ${(props) => (props.$severity === "MIN" ? "black" : "white")};
`;

const TagId = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 6px;
  background: #f1f5f9;
`;

const Message = styled.span`
  flex: 1;
  font-size: 14px;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const AckButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:active {
    transform: scale(0.98);
  }
`;
