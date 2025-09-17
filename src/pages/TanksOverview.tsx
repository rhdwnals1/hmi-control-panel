import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLiveStore } from "../store/liveStore";
import { TankCard } from "../components/TankCard";
import { useAlarmSound, requestAudioPermission } from "../hooks/useAlarmSound";
import {
  checkTankStatus,
  getCriticalTanks,
  getAlarmDetails,
} from "../utils/alarmUtils";
import { getAllTankIds } from "../utils/tankUtils";

/**
 * 탱크 오버뷰 페이지
 */
export default function TanksOverview() {
  const navigate = useNavigate();
  const tags = useLiveStore((state) => state.tags);
  const [isMuted, setIsMuted] = useState(false);

  // 오디오 권한 요청
  useEffect(() => {
    requestAudioPermission();
  }, []);

  // 모든 탱크 상태 체크
  const tankStatuses = useMemo(() => {
    return getAllTankIds().map((tankId) => checkTankStatus(tankId, tags));
  }, [tags]);

  // Critical 탱크 필터링
  const criticalTanks = useMemo(
    () => getCriticalTanks(tankStatuses),
    [tankStatuses]
  );

  // Critical 알람 소리 재생
  useAlarmSound({
    shouldPlay: criticalTanks.length > 0,
    type: "critical",
    isMuted,
  });

  // Critical 알람 상태 변화 로깅
  useEffect(() => {
    if (criticalTanks.length > 0) {
      console.log(
        "Critical 알람 발생:",
        criticalTanks.map((t) => t.tankId)
      );
    }
  }, [criticalTanks]);

  const handleTankClick = (tankId: string) => {
    navigate(`/tanks/${tankId}`);
  };

  const handleCriticalTankClick = (tankId: string) => {
    window.open(`/tanks/${tankId}`, "_blank");
  };

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Title>All Tanks</Title>
          <Subtitle>18개 수조 상태 한눈에</Subtitle>
        </HeaderContent>

        {criticalTanks.length > 0 && (
          <AlertSummary>
            <AlertIcon>⚠️</AlertIcon>
            <AlertContent>
              <AlertTitle>Critical 알람 발생</AlertTitle>
              <AlertDetails>
                {criticalTanks.map((tank) => {
                  const details = getAlarmDetails(tank);
                  return (
                    <TankAlert key={tank.tankId}>
                      <TankLink
                        onClick={() => handleCriticalTankClick(tank.tankId)}
                      >
                        {tank.tankId}
                      </TankLink>
                      <AlarmList>
                        {details.map((detail, idx) => (
                          <AlarmItem key={idx}>{detail}</AlarmItem>
                        ))}
                      </AlarmList>
                    </TankAlert>
                  );
                })}
              </AlertDetails>
            </AlertContent>
            <MuteButton onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? "🔇" : "🔊"}
            </MuteButton>
          </AlertSummary>
        )}
      </Header>

      <TankGrid>
        {getAllTankIds().map((tankId) => {
          const status = tankStatuses.find((s) => s.tankId === tankId);
          return (
            <TankCard
              key={tankId}
              tankId={tankId}
              status={status}
              onOpen={() => handleTankClick(tankId)}
            />
          );
        })}
      </TankGrid>
    </Page>
  );
}

// 스타일 컴포넌트들
const Page = styled.div`
  padding: 0 24px 24px 24px;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  padding: 24px 0 16px 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const AlertSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  animation: criticalPulse 1s infinite;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  width: fit-content;
  max-width: 80%;

  @keyframes criticalPulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    50% {
      transform: scale(1.01);
      box-shadow: 0 6px 16px rgba(220, 38, 38, 0.5);
    }
  }
`;

const AlertIcon = styled.div`
  font-size: 16px;
  flex-shrink: 0;
`;

const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const AlertTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
`;

const AlertDetails = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
`;

const TankAlert = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
`;

const TankLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 4px;
    border-radius: 4px;
    text-decoration: none;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AlarmList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-wrap: wrap;
`;

const AlarmItem = styled.span`
  font-size: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 4px;
  border-radius: 8px;
  font-weight: 500;
  white-space: nowrap;
`;

const MuteButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TankGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: stretch;
  }
`;
