

export interface MeditationConfig {
  type: string // "gap" | "breath" | "sound"
  title: string
  instruction: string
  phases: MeditationPhase[] // 4 Phases: inhale, hold, exhale, hold
}

export interface MeditationPhase {
  name: string
  duration: number
  instruction: string
}