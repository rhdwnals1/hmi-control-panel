import { useEffect, useRef } from "react";

interface UseAlarmSoundProps {
  shouldPlay: boolean;
  type: "critical" | "major" | "minor";
  isMuted: boolean;
}

export const useAlarmSound = ({ shouldPlay, isMuted }: UseAlarmSoundProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!shouldPlay || isMuted) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/critical-alarm.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // 볼륨 조절
    }

    // Play the alarm with user interaction
    const playAlarm = async () => {
      try {
        if (audioRef.current && !hasPlayedRef.current) {
          await audioRef.current.play();
          hasPlayedRef.current = true;
          console.log("🚨 Critical alarm playing!");
        }
      } catch (error) {
        console.error("Failed to play alarm:", error);
        // 사용자 상호작용이 필요한 경우, 클릭 이벤트로 재생 시도
        const handleFirstClick = async () => {
          try {
            if (audioRef.current) {
              await audioRef.current.play();
              hasPlayedRef.current = true;
              console.log("🚨 Critical alarm playing after user interaction!");
            }
          } catch (e) {
            console.error("Still failed to play alarm:", e);
          }
          document.removeEventListener("click", handleFirstClick);
        };
        document.addEventListener("click", handleFirstClick);
      }
    };

    playAlarm();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [shouldPlay, isMuted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
};
