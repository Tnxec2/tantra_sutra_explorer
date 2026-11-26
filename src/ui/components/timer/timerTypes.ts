export type SoundOption = { file: string; image?: string };

export type IntervalSound = {
  id: string;
  file: string;
  intervalMinutes: number;
  repeat: boolean;
};

export type TimerProfile = {
  id: string;
  name: string;
  durationMinutes: number;
  startPauseSeconds: number;
  startSound: string;
  intervalSounds: IntervalSound[];
  endSound: string;
  music: string;
};