import { DailyPractice } from "./DailyPractice"
import { MeditationConfig } from "./MeditationConfig"
import { PhilosophicalNote } from "./PhilosophicalNote"
import { Vocabulary } from "./Vocabulary"

export interface SUTRA {
  id: string
  chapter: string
  verseNum: string
  title: string
  subtitle: string
  sanskrit: string
  iast: string
  audioUrl?: string
  vocabulary: Vocabulary[]
  translationGerman: string
  philosophicalNotes: PhilosophicalNote[]
  dailyPractices: DailyPractice[]
  meditationConfig: MeditationConfig
}