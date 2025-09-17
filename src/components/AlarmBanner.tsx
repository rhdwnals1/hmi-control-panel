import styled from "styled-components";
import { useLiveStore } from "../store/liveStore";

export default function AlarmBanner() {
  const { alarms } = useLiveStore();
  const criticals = alarms.filter((a) => a.active && a.severity === "CRIT");
  if (!criticals.length) return null;
  return (
    <BannerContainer>
      <BannerContent>
        <WarningIcon>⚠️</WarningIcon>
        <BannerText>Critical {criticals.length} — 즉시 확인 필요</BannerText>
      </BannerContent>
    </BannerContainer>
  );
}

const BannerContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  background: linear-gradient(to right, #dc2626, #dc2626);
  color: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
`;
