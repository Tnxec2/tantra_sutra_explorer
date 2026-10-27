

export interface MeditationConfig {
  type: string
  title: string
  instruction: string
  phases: MeditationPhase[] // 4 Phases: inhale, hold, exhale, hold
}

export interface MeditationPhase {
  name: string
  duration: number
  instruction: string
}