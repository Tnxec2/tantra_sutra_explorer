import { IntervalSound, TimerProfile } from "./timerTypes";

const STORAGE_KEY = "tantra_sutras_explorer.meditation_timers";
const SELECTED_PROFILE_KEY = "tantra_sutras_explorer.selected_meditation_timer";

export function loadSelectedProfileId(): string {
  try {
    return localStorage.getItem(SELECTED_PROFILE_KEY) ?? "";
  } catch (error) {
    console.error("Das zuletzt ausgewählte Timerprofil konnte nicht geladen werden.", error);
    return "";
  }
}

export function saveSelectedProfileId(profileId: string) {
  try {
    localStorage.setItem(SELECTED_PROFILE_KEY, profileId);
  } catch (error) {
    console.error("Das zuletzt ausgewählte Timerprofil konnte nicht gespeichert werden.", error);
    throw Error("Das zuletzt ausgewählte Timerprofil konnte nicht gespeichert werden.");
  }
}


export const blankProfile = (): TimerProfile => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: "Meine Meditation",
  durationMinutes: 20,
  startPauseSeconds: 10,
  startSound: "bell_ombu.mp3",
  intervalSounds: [blankIntervalSound()],
  endSound: "bell_ombu.mp3",
  music: "",
});

export const blankIntervalSound = (): IntervalSound => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  file: "bell_basu.mp3",
  intervalMinutes: 5,
  repeat: true,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isIntervalSound(value: unknown): value is IntervalSound {
  return isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.file === "string" &&
    typeof value.intervalMinutes === "number" &&
    typeof value.repeat === "boolean";
}

function parseProfile(value: unknown): TimerProfile | null {
  if (!isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.durationMinutes !== "number" ||
    typeof value.startPauseSeconds !== "number" ||
    typeof value.startSound !== "string" ||
    typeof value.endSound !== "string" ||
    typeof value.music !== "string") {
    return null;
  }

  let intervalSounds: IntervalSound[];
  if (Array.isArray(value.intervalSounds)) {
    intervalSounds = value.intervalSounds.filter(isIntervalSound);
  } else if (typeof value.intervalSound === "string" && typeof value.intervalMinutes === "number") {
    intervalSounds = value.intervalMinutes > 0 && value.intervalSound
      ? [{
        ...blankIntervalSound(),
        file: value.intervalSound,
        intervalMinutes: value.intervalMinutes,
      }]
      : [];
  } else {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    durationMinutes: value.durationMinutes,
    startPauseSeconds: value.startPauseSeconds,
    startSound: value.startSound,
    intervalSounds,
    endSound: value.endSound,
    music: value.music,
  };
}

export function loadProfiles(): TimerProfile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [blankProfile()];
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const profiles = parsed.map(parseProfile).filter((profile): profile is TimerProfile => profile !== null);
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