import styled from "styled-components";

export default function KpiTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <TileContainer>
      <Label>{label}</Label>
      <ValueContainer>
        {value}
        {unit && <Unit>{unit}</Unit>}
      </ValueContainer>
    </TileContainer>
  );
}

const TileContainer = styled.div`
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const Label = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
`;

const ValueContainer = styled.div`
  font-size: 30px;
  font-weight: bold;
  letter-spacing: -0.025em;
  display: flex;
  align-items: baseline;
`;

const Unit = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: #64748b;
  margin-left: 4px;
`;
