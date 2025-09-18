import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";

interface DataPoint {
  time: number;
  DO?: number;
  TEMP?: number;
  PH?: number;
  SAL?: number;
}

interface MultiLineChartProps {
  data: DataPoint[];
  visibleSeries: {
    DO: boolean;
    TEMP: boolean;
    PH: boolean;
    SAL: boolean;
  };
  height?: number;
  width?: number;
  timeRange?: number; // 초 단위
}

const SERIES_COLORS = {
  DO: "#3b82f6",
  TEMP: "#10b981",
  PH: "#f59e0b",
  SAL: "#8b5cf6",
};

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  visibleSeries,
  height = 300,
  width = 400,
  timeRange = 60, // 기본 60초
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<Record<string, ISeriesApi<"Line"> | null>>({});
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    time: string;
    values: Record<string, number>;
  }>({
    visible: false,
    x: 0,
    y: 0,
    time: "",
    values: {},
  });
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#64748b",
      },
      width: chartContainerRef.current.clientWidth,
      height,
      grid: {
        vertLines: { color: "#e2e8f0" },
        horzLines: { color: "#e2e8f0" },
      },
      crosshair: {
        mode: 1,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
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

    // Create series for each sensor
    Object.keys(SERIES_COLORS).forEach((key) => {
      const series = chart.addSeries(LineSeries, {
        color: SERIES_COLORS[key as keyof typeof SERIES_COLORS],
        lineWidth: 2,
        visible: visibleSeries[key as keyof typeof visibleSeries],
      });
      seriesRefs.current[key] = series;
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    // Handle crosshair move for tooltip
    const handleCrosshairMove = (param: {
      point?: { x: number; y: number };
      time?: Time;
      logicalIndex?: number;
    }) => {
      console.log("Crosshair move:", param);

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

      const values: Record<string, number> = {};
      let tooltipTime = new Date().toLocaleTimeString();

      // Get values for each visible series using coordinateToPrice
      Object.keys(SERIES_COLORS).forEach((key) => {
        const series = seriesRefs.current[key];
        if (
          series &&
          visibleSeries[key as keyof typeof visibleSeries] &&
          param.point
        ) {
          try {
            const price = series.coordinateToPrice(param.point.y);
            if (price !== null) {
              values[key] = price;
              console.log(`Series ${key} value:`, price);
            }
          } catch (error) {
            console.log(`Error getting value for ${key}:`, error);
          }
        }
      });

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

      console.log("Tooltip values:", values);

      setTooltip({
        visible: true,
        x: param.point.x,
        y: param.point.y,
        time: tooltipTime,
        values,
      });
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    // Track user interactions (zoom, pan)
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    chart.subscribeClick(handleUserInteraction);
    chart.timeScale().subscribeVisibleTimeRangeChange(handleUserInteraction);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [height, width, visibleSeries]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Update series visibility
    Object.keys(visibleSeries).forEach((key) => {
      const series = seriesRefs.current[key];
      if (series) {
        series.applyOptions({
          visible: visibleSeries[key as keyof typeof visibleSeries],
        });
      }
    });
  }, [visibleSeries]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    console.log("MultiLineChart data update:", data);

    // Sort data by time and remove duplicates
    const sortedData = [...data].sort((a, b) => a.time - b.time);

    // Remove duplicate timestamps by keeping the last occurrence
    const uniqueData = sortedData.reduce((acc, current) => {
      const existingIndex = acc.findIndex((item) => item.time === current.time);
      if (existingIndex !== -1) {
        acc[existingIndex] = current; // Replace with latest data
      } else {
        acc.push(current);
      }
      return acc;
    }, [] as DataPoint[]);

    console.log("Unique data:", uniqueData);

    // Update data for each series
    Object.keys(SERIES_COLORS).forEach((key) => {
      const series = seriesRefs.current[key];
      if (series) {
        const seriesData = uniqueData
          .map((point) => ({
            time: point.time as Time,
            value: point[key as keyof DataPoint] as number,
          }))
          .filter((point) => point.value !== undefined);

        console.log(`Series ${key} data:`, seriesData);
        series.setData(seriesData);
      }
    });

    // Update visible range based on timeRange only if user hasn't interacted
    if (
      chartRef.current &&
      uniqueData.length > 0 &&
      !userInteractedRef.current
    ) {
      const latestTime = uniqueData[uniqueData.length - 1].time;
      chartRef.current.timeScale().setVisibleRange({
        from: (latestTime - timeRange) as Time,
        to: latestTime as Time,
      });
    }
  }, [data, timeRange]);

  // Update visible range when timeRange changes (reset user interaction)
  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const latestTime = data[data.length - 1].time;
      chartRef.current.timeScale().setVisibleRange({
        from: (latestTime - timeRange) as Time,
        to: latestTime as Time,
      });
      // Reset user interaction when timeRange changes
      userInteractedRef.current = false;
    }
  }, [timeRange, data]);

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
              tooltip.x > (chartContainerRef.current?.clientWidth || 0) - 200
                ? "translateX(-100%)"
                : "translateX(0)",
          }}
        >
          <div className="text-sm font-semibold text-gray-800 mb-2">
            {tooltip.time}
          </div>
          <div className="space-y-1">
            {Object.entries(tooltip.values).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      SERIES_COLORS[key as keyof typeof SERIES_COLORS],
                  }}
                />
                <span className="text-xs text-gray-600">{key}:</span>
                <span className="text-xs font-medium">
                  {value.toFixed(2)}
                  {key === "DO" && " mg/L"}
                  {key === "TEMP" && " °C"}
                  {key === "PH" && " pH"}
                  {key === "SAL" && " ppt"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
