import { useEffect } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { startAlarmBeeping, stopAlarmBeeping } from '../utils/audioAlarm';

export const useTimerEngine = () => {
  const {
    isStopwatchRunning,
    tickStopwatch,
    isTimerRunning,
    tickTimer,
    isTimerAlarmActive
  } = useSimulatorStore();

  // Background Tick Intervals
  useEffect(() => {
    const interval = setInterval(() => {
      if (isStopwatchRunning) tickStopwatch();
      if (isTimerRunning) tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isStopwatchRunning, isTimerRunning, tickStopwatch, tickTimer]);

  // Handle Alarm Audio
  useEffect(() => {
    if (isTimerAlarmActive) {
      startAlarmBeeping();
    } else {
      stopAlarmBeeping();
    }
  }, [isTimerAlarmActive]);
};