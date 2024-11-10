import React, { useEffect, useState, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialTime: number;
  onTimeUp?: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  const handleTimeUp = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      onTimeUp?.();
    }
  }, [onTimeUp, isActive]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [handleTimeUp, isActive]);

  // Reset timer when initial time changes (new round)
  useEffect(() => {
    setTimeLeft(initialTime);
    setIsActive(true);
  }, [initialTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <Clock className="w-5 h-5" />
        <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default Timer;