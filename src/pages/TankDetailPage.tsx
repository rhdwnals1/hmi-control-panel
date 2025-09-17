import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ReferenceLine,
  ReferenceArea,
  ComposedChart,
} from "recharts";
// import { useMockLiveStream } from "../lib/mockStream";
import { useLiveStore } from "../store/liveStore";
import type { Alarm, TagId } from "../types";
import { timeAgo } from "../utils/time";
import { SENSOR_KEYS } from "../constants";

export default function TankDetailPageStyled() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const setTags = useLiveStore((s) => s.setTags);
  const setAlarms = useLiveStore((s) => s.setAlarms);
  const { tags, ackAlarm, alarms } = useLiveStore();

  // 실제 데이터로 업데이트
  const values = React.useMemo(() => {
    if (!tankId) return {};
    const now = Date.now();
    return {
      [`${tankId}.DO`]: {
        id: `${tankId}.DO`,
        label: `${tankId}.DO`,
        value: 6.1 + (Math.random() - 0.5) * 0.2,
        ts: now,
        quality: "GOOD" as const,
      },
      [`${tankId}.TEMP`]: {
        id: `${tankId}.TEMP`,
        label: `${tankId}.TEMP`,
        value: 15.1 + (Math.random() - 0.5) * 0.2,
        ts: now,
        quality: "GOOD" as const,
      },
      [`${tankId}.PH`]: {
        id: `${tankId}.PH`,
        label: `${tankId}.PH`,
        value: 7.52 + (Math.random() - 0.5) * 0.02,
        ts: now,
        quality: "GOOD" as const,
      },
      [`${tankId}.SAL`]: {
        id: `${tankId}.SAL`,
        label: `${tankId}.SAL`,
        value: 30.1 + (Math.random() - 0.5) * 0.1,
        ts: now,
        quality: "GOOD" as const,
      },
    };
  }, [tankId]);

  React.useEffect(() => {
    setTags(values);
  }, [values, setTags]);

  // 1초마다 데이터 업데이트
  React.useEffect(() => {
    if (!tankId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const newValues = {
        [`${tankId}.DO`]: {
          id: `${tankId}.DO`,
          label: `${tankId}.DO`,
          value: 6.1 + (Math.random() - 0.5) * 0.2,
          ts: now,
          quality: "GOOD" as const,
        },
        [`${tankId}.TEMP`]: {
          id: `${tankId}.TEMP`,
          label: `${tankId}.TEMP`,
          value: 15.1 + (Math.random() - 0.5) * 0.2,
          ts: now,
          quality: "GOOD" as const,
        },
        [`${tankId}.PH`]: {
          id: `${tankId}.PH`,
          label: `${tankId}.PH`,
          value: 7.52 + (Math.random() - 0.5) * 0.02,
          ts: now,
          quality: "GOOD" as const,
        },
        [`${tankId}.SAL`]: {
          id: `${tankId}.SAL`,
          label: `${tankId}.SAL`,
          value: 30.1 + (Math.random() - 0.5) * 0.1,
          ts: now,
          quality: "GOOD" as const,
        },
      };
      setTags(newValues);
    }, 1000);

    return () => clearInterval(interval);
  }, [setTags, tankId]);

  const tag = React.useCallback((id: TagId) => tags[id], [tags]);

  // 현재 센서 값들
  const sensorValues = React.useMemo(
    () => ({
      DO: tag(`${tankId}.DO` as TagId)?.value ?? 6.1,
      TEMP: tag(`${tankId}.TEMP` as TagId)?.value ?? 15.1,
      PH: tag(`${tankId}.PH` as TagId)?.value ?? 7.52,
      SAL: tag(`${tankId}.SAL` as TagId)?.value ?? 30.1,
    }),
    [tag, tankId]
  );

  // ① 시리즈 토글 상태
  const [seriesOn, setSeriesOn] = React.useState({
    DO: true,
    TEMP: true,
    PH: false,
    SAL: false,
  });

  // ② 빠른 창(초 단위, DO/TEMP 중심 + PH/SAL 포함)
  const [fastData, setFastData] = React.useState(() => {
    const now = Date.now();
    return Array.from({ length: 60 }, (_, i) => now - (59 - i) * 1000).map(
      (ts) => ({
        ts,
        DO: 6.5 + (Math.random() - 0.5) * 0.2,
        TEMP: 15.2 + (Math.random() - 0.5) * 0.2,
        PH: 7.8 + (Math.random() - 0.5) * 0.02,
        SAL: 35.5 + (Math.random() - 0.5) * 0.1,
        // 배경 영역을 위한 고정값들
        DO_MIN: 6,
        DO_MAX: 8,
        TEMP_MIN: 10,
        TEMP_MAX: 18,
      })
    );
  });

  // 차트 데이터 업데이트 (연속성 유지)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFastData((prevData) => {
        const now = Date.now();
        const newData = [...prevData.slice(1)]; // 첫 번째 데이터 제거
        newData.push({
          ts: now,
          DO: sensorValues.DO + (Math.random() - 0.5) * 0.2,
          TEMP: sensorValues.TEMP + (Math.random() - 0.5) * 0.2,
          PH: sensorValues.PH + (Math.random() - 0.5) * 0.02,
          SAL:
            Math.min(Math.max(sensorValues.SAL ?? 35.5, 0), 40) +
            (Math.random() - 0.5) * 0.1,
          // 배경 영역을 위한 고정값들
          DO_MIN: 6,
          DO_MAX: 8,
          TEMP_MIN: 10,
          TEMP_MAX: 18,
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sensorValues]);

  // ③ 느린 창(24h, pH/SAL 전용)
  const [slowData, setSlowData] = React.useState(() => {
    const now = Date.now();
    return Array.from(
      { length: 48 },
      (_, i) => now - (47 - i) * 30 * 60 * 1000
    ).map((ts) => ({
      ts,
      PH: 7.8 + (Math.random() - 0.5) * 0.1,
      SAL: 35.5 + (Math.random() - 0.5) * 0.5,
    }));
  });

  // 24h 차트 데이터 업데이트 (연속성 유지)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSlowData((prevData) => {
        const now = Date.now();
        const newData = [...prevData.slice(1)]; // 첫 번째 데이터 제거
        newData.push({
          ts: now,
          PH: sensorValues.PH + (Math.random() - 0.5) * 0.1,
          SAL:
            Math.min(Math.max(sensorValues.SAL ?? 35.5, 0), 40) +
            (Math.random() - 0.5) * 0.5,
        });
        return newData;
      });
    }, 30 * 60 * 1000); // 30분마다 업데이트

    return () => clearInterval(interval);
  }, [sensorValues]);

  const criticals = alarms.filter(
    (a) => a.active && a.severity === "CRIT" && a.tagId.startsWith(tankId || "")
  );

  // 실제 알림 생성 로직
  React.useEffect(() => {
    if (!tankId) return;

    const newAlarms: Alarm[] = [];

    // 각 센서별로 알람 체크
    SENSOR_KEYS.forEach((sensor) => {
      const tag = tags[`${tankId}.${sensor}`];
      if (!tag || typeof tag.value !== "number") return;

      let severity: "CRIT" | "MAJ" | "MIN" | "INFO" | null = null;
      let message = "";

      // DO 체크 (5.0 미만이면 Critical)
      if (sensor === "DO" && tag.value < 5.0) {
        severity = "CRIT";
        message = "용존산소 농도가 위험 수준입니다! 즉시 확인하세요.";
      }
      // TEMP 체크 (10도 미만 또는 20도 초과)
      else if (sensor === "TEMP" && (tag.value < 10.0 || tag.value > 20.0)) {
        severity = "CRIT";
        message = "수온이 비정상적입니다! 온도 조절이 필요합니다.";
      }
      // PH 체크 (6.8 미만 또는 8.2 초과)
      else if (sensor === "PH" && (tag.value < 6.8 || tag.value > 8.2)) {
        severity = "CRIT";
        message = "pH가 비정상적입니다! 수질 조절이 필요합니다.";
      }
      // SAL 체크 (25 미만 또는 35 초과)
      else if (sensor === "SAL" && (tag.value < 25 || tag.value > 35)) {
        severity = "CRIT";
        message = "염도가 비정상적입니다! 염분 조절이 필요합니다.";
      }

      if (severity) {
        newAlarms.push({
          id: `${tankId}-${sensor}-CRIT-${Date.now()}`,
          tagId: `${tankId}.${sensor}`,
          severity: severity as "CRIT" | "MAJ" | "MIN" | "INFO",
          message,
          active: true,
          ts: Date.now(),
          acknowledged: false,
        });
      }
    });

    if (newAlarms.length > 0) {
      setAlarms(newAlarms);
    }
  }, [tankId, tags, setAlarms]);

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
            <BackButton onClick={() => navigate("/tanks")}>
              ← 전체탱크
            </BackButton>
            <Title>{tankId}-HMI</Title>
            <Subtle>
              마지막 업데이트: {new Date().toLocaleTimeString()} · 현재: Online
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
            <CircularGauge>
              <GaugeValue>
                {sensorValues.DO.toFixed(1)}
                <GaugeUnit>mg/L</GaugeUnit>
              </GaugeValue>
              <GaugeArc $value={sensorValues.DO} $max={10} $color="#3b82f6" />
            </CircularGauge>
            <Subtle>용존산소 (DO)</Subtle>
            <KPITarget>목표 6mg/L+</KPITarget>
          </Card>
          <Card>
            <CircularGauge>
              <GaugeValue>
                {sensorValues.TEMP.toFixed(1)}
                <GaugeUnit>°C</GaugeUnit>
              </GaugeValue>
              <GaugeArc $value={sensorValues.TEMP} $max={25} $color="#10b981" />
            </CircularGauge>
            <Subtle>수온</Subtle>
            <KPITarget>목표 10~18°C</KPITarget>
          </Card>
          <Card>
            <CircularGauge>
              <GaugeValue>
                {sensorValues.PH.toFixed(2)}
                <GaugeUnit>pH</GaugeUnit>
              </GaugeValue>
              <GaugeArc $value={sensorValues.PH} $max={10} $color="#f59e0b" />
            </CircularGauge>
            <Subtle>pH</Subtle>
            <KPITarget>목표 6.8~8.2pH</KPITarget>
          </Card>
          <Card>
            <CircularGauge>
              <GaugeValue>
                {Math.min(Math.max(sensorValues.SAL ?? 35.5, 0), 40).toFixed(1)}
                <GaugeUnit>ppt</GaugeUnit>
              </GaugeValue>
              <GaugeArc
                $value={Math.min(Math.max(sensorValues.SAL ?? 35.5, 0), 40)}
                $max={40}
                $color="#8b5cf6"
              />
            </CircularGauge>
            <Subtle>염도</Subtle>
            <KPITarget>목표 28~37ppt</KPITarget>
          </Card>
        </Grid>

        {/* Live Trend + 토글 */}
        <Section>
          <SectionTitle>Live Trend — 선택 시리즈</SectionTitle>
          <Chips>
            {(["DO", "TEMP", "PH", "SAL"] as const).map((k) => (
              <Chip key={k} $active={(seriesOn as Record<string, boolean>)[k]}>
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
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={fastData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ts"
                  tickFormatter={(v) => new Date(v).toLocaleTimeString()}
                  minTickGap={28}
                />
                <YAxis domain={seriesOn.SAL ? [0, 36] : [0, 20]} />
                <Tooltip
                  labelFormatter={(l) =>
                    new Date(Number(l)).toLocaleTimeString()
                  }
                  formatter={(value: number, name: string) => [
                    value.toFixed(2),
                    name,
                  ]}
                />
                <Legend />
                {/* 배경 영역 - DO와 TEMP 적정 범위 */}
                <ReferenceArea
                  y1={10}
                  y2={18}
                  fill="#10b981"
                  fillOpacity={0.1}
                />
                <ReferenceArea y1={0} y2={8} fill="#3b82f6" fillOpacity={0.1} />
                {/* 참조선들 */}
                <ReferenceLine y={5} stroke="#f97316" strokeDasharray="5 5" />
                <ReferenceLine y={8} stroke="#f97316" strokeDasharray="5 5" />
                <ReferenceLine y={6} stroke="#3b82f6" strokeDasharray="5 5" />
                {seriesOn.DO && (
                  <Line
                    type="monotone"
                    dataKey="DO"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="→ DO"
                  />
                )}
                {seriesOn.TEMP && (
                  <Line
                    type="monotone"
                    dataKey="TEMP"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="→ TEMP"
                  />
                )}
                {seriesOn.PH && (
                  <Line
                    type="monotone"
                    dataKey="PH"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="→ PH"
                  />
                )}
                {seriesOn.SAL && (
                  <Line
                    type="monotone"
                    dataKey="SAL"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    name="→ SAL"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Section>

        {/* 24h Trend — pH & SAL */}
        <Section>
          <SectionTitle>24h Trend — pH & Salinity</SectionTitle>
          <ChartWrapper>
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
                  formatter={(value: number, name: string) => [
                    value.toFixed(2),
                    name,
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="PH"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="→ PH"
                />
                <Line
                  type="monotone"
                  dataKey="SAL"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  name="→ SAL"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Section>

        {/* Faceplates */}
        <FaceplateRow>
          <Face>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>산소공급기</div>
              <Subtle>
                상태: {(tag("TANK1.DO")?.value ?? 0) < 5.2 ? "RUN" : "STOP"}
              </Subtle>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn $danger={(tag("TANK1.DO")?.value ?? 0) < 5.2}>
                {(tag("TANK1.DO")?.value ?? 0) < 5.2 ? "STOP" : "START"}
              </Btn>
              <Btn $danger>RESET</Btn>
            </div>
          </Face>
          <Face>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>펌프</div>
              <Subtle>
                상태: {(tag("TANK1.DO")?.value ?? 0) < 6.5 ? "RUN" : "STOP"}
              </Subtle>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn $danger>STOP</Btn>
              <Btn $danger>RESET</Btn>
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
                {a.active && <Btn onClick={() => ackAlarm(a.id)}>ACK</Btn>}
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

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 640px) {
    padding: 12px;
  }
`;
const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-auto-rows: max-content;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 640px) {
    gap: 12px;
  }
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
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }
`;
const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
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
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;
const Chip = styled.label<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  border: 1px solid
    ${(p) => (p.$active ? "rgba(2,132,199,0.6)" : "rgba(15,23,42,0.15)")};
  background: ${(p) =>
    p.$active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)"};
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
`;
const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
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

const CircularGauge = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 12px;
  }

  @media (max-width: 640px) {
    width: 80px;
    height: 80px;
    margin-bottom: 8px;
  }
`;

const GaugeValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  z-index: 10;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const GaugeUnit = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
  margin-left: 4px;
`;

const GaugeArc = styled.div<{ $value: number; $max: number; $color: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${({ $color }) => $color} 0deg,
    ${({ $color }) => $color} ${({ $value, $max }) => ($value / $max) * 360}deg,
    #e5e7eb ${({ $value, $max }) => ($value / $max) * 360}deg,
    #e5e7eb 360deg
  );
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const KPITarget = styled.div`
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  margin-top: 8px;
`;
const Section = styled(Card)`
  padding: 16px;
`;

const ChartWrapper = styled.div`
  height: 280px;
  margin-top: 12px;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 640px) {
    height: 200px;
    margin-top: 8px;
  }
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
const Btn = styled.button<{ $danger?: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid ${(p) => (p.$danger ? "#fb7185" : "#cbd5e1")};
  background: ${(p) => (p.$danger ? "#ffe4e6" : "#fff")};
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
