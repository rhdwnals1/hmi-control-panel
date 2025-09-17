import { useEffect, useRef, useState } from "react";
import { useLiveStore } from "../store/liveStore";
import { DEFAULT_SENSOR_VALUES, ALARM_CYCLES } from "../constants";
import type { TagValue } from "../types";

interface UseLightStreamProps {
  tagIds: string[];
  visible: boolean;
}

/**
 * 가벼운 데이터 스트림 훅 (오버뷰 카드용)
 */
export const useLightStream = ({
  tagIds,
  visible,
}: UseLightStreamProps): void => {
  const setTags = useLiveStore((state) => state.setTags);

  useEffect(() => {
    if (!visible) return;

    let isActive = true;

    const updateData = () => {
      if (!isActive) return;

      const patch: Record<string, TagValue> = {};
      const now = Date.now();

      tagIds.forEach((id) => {
        const sensor = id.split(".")[1] as keyof typeof DEFAULT_SENSOR_VALUES;
        const baseValue = DEFAULT_SENSOR_VALUES[sensor];

        // 알람 생성 로직
        const tankNum = parseInt(id.split(".")[0].replace("TANK", ""), 10);
        const cycle = Math.floor(now / ALARM_CYCLES.CRITICAL);
        const majorCycle = Math.floor(now / ALARM_CYCLES.MAJOR);

        const shouldHaveCritical = (cycle + tankNum) % 18 < 1;
        const shouldHaveMajor = (majorCycle + tankNum + 7) % 18 < 1;

        let value: number = baseValue;

        if (shouldHaveCritical) {
          value = generateCriticalValue(sensor);
        } else if (shouldHaveMajor) {
          value = generateMajorValue(sensor);
        } else {
          // 정상 범위 내에서 약간의 변동
          const jitter = (Math.random() - 0.5) * 0.2;
          value = Number((baseValue + jitter).toFixed(2));
        }

        patch[id] = {
          id,
          label: id,
          value,
          ts: now,
          quality: "GOOD",
        };
      });

      setTags(patch);
    };

    // 즉시 실행
    updateData();

    // 1초마다 업데이트
    const interval = setInterval(updateData, 1000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [tagIds, visible, setTags]);
};

/**
 * Critical 알람 값을 생성합니다.
 */
const generateCriticalValue = (sensor: string): number => {
  switch (sensor) {
    case "DO":
      return 4.5 + Math.random() * 0.5; // 4.5-5.0
    case "TEMP":
      return 9 + Math.random() * 1; // 9-10
    case "PH":
      return 6.5 + Math.random() * 0.3; // 6.5-6.8
    case "SAL":
      return 24 + Math.random() * 1; // 24-25
    default:
      return DEFAULT_SENSOR_VALUES[
        sensor as keyof typeof DEFAULT_SENSOR_VALUES
      ];
  }
};

/**
 * Major 알람 값을 생성합니다.
 */
const generateMajorValue = (sensor: string): number => {
  switch (sensor) {
    case "DO":
      return 5.2 + Math.random() * 0.3; // 5.2-5.5
    case "TEMP":
      return 12.5 + Math.random() * 1; // 12.5-13.5
    case "PH":
      return 6.9 + Math.random() * 0.1; // 6.9-7.0
    case "SAL":
      return 26.5 + Math.random() * 1; // 26.5-27.5
    default:
      return DEFAULT_SENSOR_VALUES[
        sensor as keyof typeof DEFAULT_SENSOR_VALUES
      ];
  }
};

/**
 * Intersection Observer를 사용한 가시성 감지 훅
 */
export const useLightVisible = (tagIds: string[]) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 데이터 스트림 시작
  useLightStream({ tagIds, visible });

  return ref;
};
