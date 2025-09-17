import { useEffect, useRef } from "react";
import { SOUND_FILES, UI_CONSTANTS } from "../constants";

interface UseAlarmSoundProps {
  shouldPlay: boolean;
  type: "critical" | "major" | "minor";
  isMuted?: boolean;
}

/**
 * 알람 소리 재생 훅
 */
export const useAlarmSound = ({
  shouldPlay,
  type,
  isMuted = false,
}: UseAlarmSoundProps): void => {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 알람이 없거나 음소거 상태면 소리 중지
    if (!shouldPlay || isMuted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const soundFile = SOUND_FILES[type];

    // 즉시 재생
    const playSound = () => {
      const audio = new Audio(soundFile);
      audio.volume = UI_CONSTANTS.AUDIO_VOLUME;
      audio.play().catch((error) => {
        console.warn(`사운드 재생 실패: ${soundFile}`, error);
      });
    };

    playSound();

    // 반복 재생 설정
    intervalRef.current = window.setInterval(
      playSound,
      UI_CONSTANTS.ALARM_REPEAT_INTERVAL
    );

    // 정리 함수
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldPlay, type, isMuted]);
};

/**
 * 오디오 권한 요청 함수
 */
export const requestAudioPermission = async (): Promise<void> => {
  if (typeof window === "undefined" || !("AudioContext" in window)) {
    return;
  }

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioContext = new AudioContextClass();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  } catch (error) {
    console.warn("오디오 권한 요청 실패:", error);
  }
};
