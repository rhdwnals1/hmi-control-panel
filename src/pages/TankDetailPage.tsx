import React from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMockLiveStream } from "../lib/mockStream";
import { useLiveStore } from "../store/liveStore";
import type { TagId } from "../types";
import { timeAgo } from "../utils/time";

export default function TankDetailPageStyled() {
  const tagIds = ["TANK1.DO", "TANK1.TEMP", "TANK1.PH", "TANK1.SAL"] as TagId[];
  const { values, alarms } = useMockLiveStream(tagIds);
  const setTags = useLiveStore((s) => s.setTags);
  const setAlarms = useLiveStore((s) => s.setAlarms);
  const { tags, ackAlarm } = useLiveStore();

  React.useEffect(() => {
    setTags(values);
  }, [values, setTags]);
  React.useEffect(() => {
    setAlarms(alarms);
  }, [alarms, setAlarms]);

  const tag = (id: TagId) => tags[id];

  // ① 시리즈 토글 상태
  const [seriesOn, setSeriesOn] = React.useState({
    DO: true,
    TEMP: true,
    PH: false,
    SAL: false,
  });

  // ② 빠른 창(초 단위, DO/TEMP 중심 + PH/SAL 포함)
  const fastData = React.useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 60 }, (_, i) => now - (59 - i) * 1000).map(
      (ts) => ({
        ts,
        DO: (tag("TANK1.DO")?.value ?? 6) + (Math.random() - 0.5) * 0.2,
        TEMP: (tag("TANK1.TEMP")?.value ?? 22) + (Math.random() - 0.5) * 0.2,
        PH: (tag("TANK1.PH")?.value ?? 7.6) + (Math.random() - 0.5) * 0.02,
        SAL: (tag("TANK1.SAL")?.value ?? 30) + (Math.random() - 0.5) * 0.1,
      })
    );
  }, [values]);

  // ③ 느린 창(24h, pH/SAL 전용)
  const slowData = React.useMemo(() => {
    const now = Date.now();
    return Array.from(
      { length: 48 },
      (_, i) => now - (47 - i) * 30 * 60 * 1000
    ).map((ts) => ({
      ts,
      PH: (tag("TANK1.PH")?.value ?? 7.6) + (Math.random() - 0.5) * 0.03,
      SAL: (tag("TANK1.SAL")?.value ?? 30) + (Math.random() - 0.5) * 0.15,
    }));
  }, [values]);

  const criticals = alarms.filter((a) => a.active && a.severity === "CRIT");

  function rateExceeded(
    data: Array<{ ts: number; PH: number; SAL: number }>,
    key: "PH" | "SAL",
    thr: number
  ) {
    if (data.length < 2) return false;
    const last = data[data.length - 1][key];
    const ref = data[Math.max(0, data.length - 30)][key]; // 대략 30분 전 포인트(데모에선 간격 가정)
    return (
      typeof last === "number" &&
      typeof ref === "number" &&
      Math.abs(last - ref) >= thr
    );
  }

  const promotePH = rateExceeded(fastData, "PH", 0.15);
  const promoteSAL = rateExceeded(fastData, "SAL", 1.0);

  // 자동 토글
  React.useEffect(() => {
    if (promotePH) setSeriesOn((s) => ({ ...s, PH: true }));
    if (promoteSAL) setSeriesOn((s) => ({ ...s, SAL: true }));
  }, [promotePH, promoteSAL]);

  return (
    <Page>
      <Container>
        <HeaderCard>
          <div>
            <Title>Tank #1</Title>
            <Subtle>
              마지막 업데이트: {new Date().toLocaleTimeString()} · 연결: Online
            </Subtle>
          </div>
          <Subtle>단위: mg/L, °C, pH, ppt</Subtle>
        </HeaderCard>

        {criticals.length > 0 && (
          <Banner>⚠️ Critical {criticals.length} — 즉시 확인 필요</Banner>
        )}

        {/* KPI */}
        <Grid>
          <Card>
            <Subtle>용존산소 (DO)</Subtle>
            <KPIValue>
              {tag("TANK1.DO")?.value?.toFixed(1) ?? "—"}
              <KPIUnit>mg/L</KPIUnit>
            </KPIValue>
          </Card>
          <Card>
            <Subtle>수온</Subtle>
            <KPIValue>
              {tag("TANK1.TEMP")?.value?.toFixed(1) ?? "—"}
              <KPIUnit>°C</KPIUnit>
            </KPIValue>
          </Card>
          <Card>
            <Subtle>pH</Subtle>
            <KPIValue>
              {tag("TANK1.PH")?.value?.toFixed(2) ?? "—"}
              <KPIUnit>pH</KPIUnit>
            </KPIValue>
          </Card>
          <Card>
            <Subtle>염도</Subtle>
            <KPIValue>
              {tag("TANK1.SAL")?.value?.toFixed(1) ?? "—"}
              <KPIUnit>ppt</KPIUnit>
            </KPIValue>
          </Card>
        </Grid>

        {/* Live Trend + 토글 */}
        <Section>
          <SectionTitle>Live Trend — 선택 시리즈</SectionTitle>
          <Chips>
            {(["DO", "TEMP", "PH", "SAL"] as const).map((k) => (
              <Chip key={k} active={(seriesOn as Record<string, boolean>)[k]}>
                <input
                  type="checkbox"
                  checked={(seriesOn as Record<string, boolean>)[k]}
                  onChange={(e) =>
                    setSeriesOn((s) => ({ ...s, [k]: e.target.checked }))
                  }
                />
                {k}
              </Chip>
            ))}
          </Chips>
          <div style={{ height: 280, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={fastData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ts"
                  tickFormatter={(v) => new Date(v).toLocaleTimeString()}
                  minTickGap={28}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(l) =>
                    new Date(Number(l)).toLocaleTimeString()
                  }
                />
                <Legend />
                {seriesOn.DO && (
                  <Line
                    type="monotone"
                    dataKey="DO"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {seriesOn.TEMP && (
                  <Line
                    type="monotone"
                    dataKey="TEMP"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {seriesOn.PH && (
                  <Line
                    type="monotone"
                    dataKey="PH"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {seriesOn.SAL && (
                  <Line
                    type="monotone"
                    dataKey="SAL"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* 24h Trend — pH & SAL */}
        <Section>
          <SectionTitle>24h Trend — pH & Salinity</SectionTitle>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={slowData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ts"
                  tickFormatter={(v) => new Date(v).toLocaleString()}
                  minTickGap={30}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(l) => new Date(Number(l)).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="PH"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="SAL"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Faceplates */}
        <FaceplateRow>
          <Face>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>AERATOR-1</div>
              <Subtle>
                상태: {(tag("TANK1.DO")?.value ?? 0) < 5.2 ? "RUN" : "STOP"}
              </Subtle>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn danger={(tag("TANK1.DO")?.value ?? 0) < 5.2}>
                {(tag("TANK1.DO")?.value ?? 0) < 5.2 ? "STOP" : "START"}
              </Btn>
              <Btn danger>RESET</Btn>
            </div>
          </Face>
          <Face>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>PUMP-1</div>
              <Subtle>상태: RUN</Subtle>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn danger>STOP</Btn>
              <Btn danger>RESET</Btn>
            </div>
          </Face>
        </FaceplateRow>

        {/* Alarms */}
        <Section>
          <SectionTitle>Alarms</SectionTitle>
          <div style={{ display: "grid", gap: 10 }}>
            {alarms.map((a) => (
              <AlarmRow key={a.id}>
                <Pill variant={a.severity as "CRIT" | "MAJ" | "MIN" | "INFO"}>
                  {a.severity}
                </Pill>
                <Subtle
                  style={{
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}
                >
                  {a.tagId}
                </Subtle>
                <div style={{ flex: 1 }}>{a.message}</div>
                <Subtle>{timeAgo(a.ts)}</Subtle>
                {!a.acknowledged && (
                  <Btn onClick={() => ackAlarm(a.id)}>ACK</Btn>
                )}
              </AlarmRow>
            ))}
          </div>
        </Section>
      </Container>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #e0f2fe 0%, #f1f5f9 100%);
  padding: 24px;
`;
const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-auto-rows: max-content;
  gap: 20px;
`;
const HeaderCard = styled.div`
  border-radius: 24px;
  padding: 24px;
  color: #fff;
  background: linear-gradient(90deg, #0284c7 0%, #06b6d4 100%);
  box-shadow: 0 10px 24px rgba(2, 132, 199, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;
const Subtle = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;
const Chips = styled.div`
  display: flex;
  gap: 8px;
`;
const Chip = styled.label<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  border: 1px solid
    ${(p) => (p.active ? "rgba(2,132,199,0.6)" : "rgba(15,23,42,0.15)")};
  background: ${(p) =>
    p.active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)"};
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
`;
const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const Card = styled.div`
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.06);
`;
const KPIValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;
const KPIUnit = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #64748b;
  margin-left: 6px;
`;
const Section = styled(Card)`
  padding: 16px;
`;
const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
`;
const FaceplateRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Face = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Btn = styled.button<{ danger?: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid ${(p) => (p.danger ? "#fb7185" : "#cbd5e1")};
  background: ${(p) => (p.danger ? "#ffe4e6" : "#fff")};
  box-shadow: 0 2px 8px rgba(2, 6, 23, 0.06);
  &:active {
    transform: scale(0.98);
  }
`;
const Banner = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  border-radius: 18px;
  padding: 12px 16px;
  color: #fff;
  background: linear-gradient(90deg, #e11d48 0%, #be123c 100%);
  box-shadow: 0 10px 24px rgba(190, 18, 60, 0.25);
`;
const Pill = styled.span<{ variant: "CRIT" | "MAJ" | "MIN" | "INFO" }>`
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  color: ${(p) => (p.variant === "MIN" ? "#111" : "#fff")};
  background: ${(p) =>
    ({ CRIT: "#e11d48", MAJ: "#f97316", MIN: "#fbbf24", INFO: "#0ea5e9" }[
      p.variant
    ])};
`;
const AlarmRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
`;
