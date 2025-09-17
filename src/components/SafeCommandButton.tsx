import { useState } from "react";
import styled from "styled-components";
import type { Command } from "../types";

export default function SafeCommandButton({
  cmd,
  targetId,
  onConfirm,
}: {
  cmd: Command["name"];
  targetId: string;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  const danger = ["STOP", "RESET"].includes(cmd);

  return (
    <ButtonContainer>
      <CommandButton $danger={danger} onClick={() => setOpen(true)}>
        {cmd}
      </CommandButton>
      {open && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              {targetId} • {cmd}
            </ModalTitle>
            <WarningBox>
              ⚠️ 실행 전 확인: 인터락 OK, 영향 범위 요약, 감사 로그 기록됨
            </WarningBox>
            <ButtonGroup>
              <CancelButton onClick={() => setOpen(false)}>취소</CancelButton>
              <ConfirmButton
                $danger={danger}
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
              >
                확인
              </ConfirmButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </ButtonContainer>
  );
}

const ButtonContainer = styled.div`
  position: relative;
`;

const CommandButton = styled.button<{ $danger: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$danger ? "#fda4af" : "#cbd5e1")};
  background: ${(props) => (props.$danger ? "#fef2f2" : "white")};
  font-size: 14px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 440px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const WarningBox = styled.div`
  border-radius: 12px;
  border: 1px solid #fde68a;
  background: #fffbeb;
  padding: 12px;
  color: #92400e;
  font-size: 14px;
  margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const ConfirmButton = styled.button<{ $danger: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  background: ${(props) => (props.$danger ? "#dc2626" : "#0f172a")};
  color: white;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
