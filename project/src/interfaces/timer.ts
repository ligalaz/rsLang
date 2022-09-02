export interface Timer {
  delay: number;
  initial: number;
  className: string;
}

export default interface TimerDetails {
  timerDetails: Timer;
  endTimer?: () => void;
}
