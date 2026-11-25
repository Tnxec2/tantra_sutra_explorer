import { SoundOption } from "./timerTypes";

export const bellSounds: SoundOption[] = [
  { file: "bell_basu.mp3", image: "basu.png" },
  { file: "bell_dengze.mp3", image: "dengze.png" },
  { file: "bell_gong.mp3", image: "gong_hanchi.png" },
  { file: "bell_kangse.mp3", image: "kangse.png" },
  { file: "bell_ombu.mp3", image: "ombu.png" },
  { file: "bell_sakya.mp3", image: "sakya.png" },
  { file: "bell_shurong.mp3", image: "shurong.png" },
  { file: "bell_wood_block.mp3", image: "wood_block.png" },
  { file: "bell_zhada.mp3", image: "zhada.png" },
];

export const musicSounds: SoundOption[] = [
  { file: "b1-birdsong.mp3", image: "b1-birdsong.jpg" },
  { file: "b1-celtic-harmony.mp3", image: "b1-celtic-harmony.jpg" },
  { file: "b1-natures-melody.mp3", image: "b1-natures-melody.jpg" },
  { file: "b1-ocean-wave.mp3", image: "b1-ocean-wave.jpg" },
  { file: "b1-reflections.mp3", image: "b1-reflections.jpg" },
  { file: "b1-stillness.mp3", image: "b1-stillness.jpg" },
  { file: "b1-tibetan-sunrise.mp3", image: "b1-tibetan-sunrise.jpg" },
  { file: "b2-angel-choir.mp3", image: "b2-angel-choir.jpg" },
  { file: "b2-enchanting.mp3", image: "b2-enchanting.jpg" },
  { file: "b2-into-the-wild.mp3", image: "b2-into-the-wild.jpg" },
  { file: "b2-limitless.mp3", image: "b2-limitless.jpg" },
  { file: "b2-lucid-dream.mp3", image: "b2-lucid-dream.jpg" },
  { file: "b2-secret-garden.mp3", image: "b2-secret-garden.jpg" },
  { file: "b2-winter-fire.mp3", image: "b2-winter-fire.jpg" },
  { file: "crystal-rain_rain-drops.mp3", image: "crystal-rain_rain-drops.jpg" },
  { file: "dbs_03_piano_moonlight.mp3", image: "dbs_03_piano_moonlight.jpg" },
  { file: "dbs_19_nylon_guitar_zen-guitar.mp3", image: "dbs_19_nylon_guitar_zen-guitar.jpg" },
  { file: "dbs_31_stream_eternal-stream.mp3", image: "dbs_31_stream_eternal-stream.jpg" },
  { file: "golden_om_deep-om.mp3", image: "golden_om_deep-om.jpg" },
];

export const soundPath = (file: string) => `./assets/sounds/${file}`;
export const imagePath = (file: string) => `./assets/images/${file}`;