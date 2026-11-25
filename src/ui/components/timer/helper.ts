import { TimerProfile } from "./timerTypes";

const STORAGE_KEY = "tantra_sutras_explorer.meditation_timers";


export const blankProfile = (): TimerProfile => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: "Meine Meditation",
  durationMinutes: 20,
  intervalMinutes: 5,
  startPauseSeconds: 10,
  startSound: "bell_ombu.mp3",
  intervalSound: "bell_basu.mp3",
  endSound: "bell_ombu.mp3",
  music: "",
});

export function loadProfiles(): TimerProfile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [blankProfile()];
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const profiles = parsed.filter((profile): profile is TimerProfile =>
        typeof profile === "object" && profile !== null &&
        typeof profile.id === "string" && typeof profile.name === "string" &&
        typeof profile.durationMinutes === "number" &&
        typeof profile.intervalMinutes === "number" &&
        typeof profile.startPauseSeconds === "number" &&
        typeof profile.startSound === "string" &&
        typeof profile.intervalSound === "string" &&
        typeof profile.endSound === "string" && typeof profile.music === "string"
      );
      if (profiles.length > 0) return profiles;
    }
  } catch (error) {
    console.error("Meditationstimer konnten nicht aus dem lokalen Speicher geladen werden.", error);
  }
  return [blankProfile()];
}

export function saveProfiles(profiles: TimerProfile[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error("Meditationstimer konnten nicht lokal gespeichert werden.", error);
      throw Error("Timer konnten nicht lokal gespeichert werden.");
    }
}

export function formatTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`
    : `${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
}

export function soundLabel(file: string) {
  return file.replace(/\.mp3$/i, "").replace(/^(b1-|b2-|dbs_\d+_|bell_)/, "").replace(/[-_]/g, " ");
}