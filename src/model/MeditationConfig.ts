

export interface MeditationConfig {
  type: string // "gap" | "breath" | "sound"
  title: string
  desc?: string
  instructions?: string[]
}

  


export interface MeditationPhase {
  name: string
  duration: number
  instruction: string
}