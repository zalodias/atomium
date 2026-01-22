import { colors, typography } from '@/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface TimerProps {
  duration: number;
  startTime: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function Timer({ duration, startTime, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (isPaused) return;

    const calculateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      const timeLeftSeconds = Math.ceil(remaining);
      const progressValue = Math.max(0, Math.min(1, remaining / duration));
      const roundedProgress = Math.round(progressValue * 100) / 100;
      return { timeLeftSeconds, progressValue: roundedProgress };
    };

    const { timeLeftSeconds, progressValue } = calculateProgress();
    setTimeLeft(timeLeftSeconds);
    setProgress(progressValue);

    const interval = setInterval(() => {
      const { timeLeftSeconds, progressValue } = calculateProgress();
      setTimeLeft(timeLeftSeconds);
      setProgress(progressValue);
      
      if (timeLeftSeconds <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, startTime, onTimeUp, isPaused]);
  
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <View style={styles.container}>
      <View style={styles.timerWrapper}>
        <Svg width={size} height={size} style={styles.progressRing}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="white"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.foreground.brand.default}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.timeText}>{timeLeft}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  timeText: {
    ...typography.display.small,
    fontFamily: typography.family,
    color: colors.foreground.neutral.strong,
    fontWeight: '600',
  },
});
