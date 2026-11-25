export type SoundOption = { file: string; image?: string };

export type TimerProfile = {
  id: string;
  name: string;
  durationMinutes: number;
  intervalMinutes: number;
  startPauseSeconds: number;
  startSound: string;
  intervalSound: string;
  endSound: string;
  music: string;
};