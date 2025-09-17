import styled from "styled-components";
import SafeCommandButton from "./SafeCommandButton";

export default function Faceplate({
  id,
  running,
}: {
  id: string;
  running: boolean;
}) {
  return (
    <FaceplateContainer>
      <InfoSection>
        <DeviceId>{id}</DeviceId>
        <Status>Status: {running ? "RUN" : "STOP"}</Status>
      </InfoSection>
      <ButtonSection>
        <SafeCommandButton
          cmd={running ? "STOP" : "START"}
          targetId={id}
          onConfirm={() => console.log("cmd", id)}
        />
        <SafeCommandButton
          cmd="RESET"
          targetId={id}
          onConfirm={() => console.log("reset", id)}
        />
      </ButtonSection>
    </FaceplateContainer>
  );
}

const FaceplateContainer = styled.div`
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeviceId = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Status = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
