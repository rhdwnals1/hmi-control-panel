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

interface TrendData {
  ts: number;
  [key: string]: number;
}

export default function TrendPanel({
  data,
  series,
}: {
  data: TrendData[];
  series: { key: string; label: string }[];
}) {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="ts"
            tickFormatter={(v) => new Date(v).toLocaleTimeString()}
            minTickGap={30}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(l) => new Date(Number(l)).toLocaleTimeString()}
          />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

const ChartContainer = styled.div`
  height: 288px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  padding: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;
