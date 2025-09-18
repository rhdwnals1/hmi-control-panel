import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";

interface LineChartProps {
  data: Array<{ time: number; value: number }>;
  color?: string;
  height?: number;
  width?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  color = "#3b82f6",
  height = 300,
  width = 400,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    time: string;
    value: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    time: "",
    value: 0,
  });
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#64748b",
      },
      width,
      height,
      grid: {
        vertLines: { color: "#e2e8f0" },
        horzLines: { color: "#e2e8f0" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#e2e8f0",
      },
      timeScale: {
        borderColor: "#e2e8f0",
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const series = chart.addSeries(LineSeries, {
      color,
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // Handle crosshair move for tooltip
    const handleCrosshairMove = (param: {
      point?: { x: number; y: number };
      time?: Time;
      logicalIndex?: number;
    }) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > height
      ) {
        setTooltip((prev) => ({ ...prev, visible: false }));
        return;
      }

      try {
        const price = series.coordinateToPrice(param.point.y);
        if (price !== null) {
          let tooltipTime = new Date().toLocaleTimeString();

          // Set time from crosshair time
          if (param.time) {
            if (typeof param.time === "number") {
              tooltipTime = new Date(param.time * 1000).toLocaleTimeString();
            } else if (typeof param.time === "string") {
              tooltipTime = new Date(param.time).toLocaleTimeString();
            } else {
              tooltipTime = new Date().toLocaleTimeString();
            }
          }

          setTooltip({
            visible: true,
            x: param.point.x,
            y: param.point.y,
            time: tooltipTime,
            value: price,
          });
        }
      } catch (error) {
        console.log("Error getting value:", error);
      }
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    // Track user interactions (zoom, pan)
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    chart.subscribeClick(handleUserInteraction);
    chart.timeScale().subscribeVisibleTimeRangeChange(handleUserInteraction);

    return () => {
      chart.remove();
    };
  }, [color, height, width]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Sort data by time and remove duplicates
      const sortedData = [...data].sort((a, b) => a.time - b.time);

      // Remove duplicate timestamps by keeping the last occurrence
      const uniqueData = sortedData.reduce((acc, current) => {
        const existingIndex = acc.findIndex(
          (item) => item.time === current.time
        );
        if (existingIndex !== -1) {
          acc[existingIndex] = current; // Replace with latest data
        } else {
          acc.push(current);
        }
        return acc;
      }, [] as Array<{ time: number; value: number }>);

      const formattedData = uniqueData.map((point) => ({
        time: point.time as Time,
        value: point.value,
      }));
      seriesRef.current.setData(formattedData);

      // Update visible range to show recent 60 seconds only if user hasn't interacted
      if (
        chartRef.current &&
        uniqueData.length > 0 &&
        !userInteractedRef.current
      ) {
        const latestTime = uniqueData[uniqueData.length - 1].time;
        chartRef.current.timeScale().setVisibleRange({
          from: (latestTime - 60) as Time,
          to: latestTime as Time,
        });
      }
    }
  }, [data]);

  return (
    <div className="relative w-full">
      <div
        ref={chartContainerRef}
        className="w-full [&_a]:hidden"
        style={{ height: `${height}px` }}
      />
      {tooltip.visible && (
        <div
          className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-10"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform:
              tooltip.x > (chartContainerRef.current?.clientWidth || 0) - 150
                ? "translateX(-100%)"
                : "translateX(0)",
          }}
        >
          <div className="text-sm font-semibold text-gray-800 mb-1">
            {tooltip.time}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-600">Value:</span>
            <span className="text-xs font-medium">
              {tooltip.value.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
