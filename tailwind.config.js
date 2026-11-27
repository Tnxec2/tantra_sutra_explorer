/** @type {import('tailwindcss').Config} */
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const semanticScale = (colorByShade) => Object.fromEntries(
  shades.map(shade => [
    shade,
    `rgb(var(${colorByShade[shade]}) / <alpha-value>)`,
  ])
);

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: semanticScale({
          50: "--theme-text-strong",
          100: "--theme-text-strong",
          200: "--theme-text",
          300: "--theme-muted",
          400: "--theme-muted",
          500: "--theme-muted",
          600: "--theme-border",
          700: "--theme-border",
          800: "--theme-border",
          900: "--theme-surface",
          950: "--theme-bg",
        }),
        amber: semanticScale({
          50: "--theme-accent-text",
          100: "--theme-accent-text",
          200: "--theme-accent-text",
          300: "--theme-accent-light",
          400: "--theme-accent",
          500: "--theme-accent",
          600: "--theme-accent-strong",
          700: "--theme-accent-strong",
          800: "--theme-accent-dark",
          900: "--theme-accent-dark",
          950: "--theme-accent-dark",
        }),
        purple: semanticScale(Object.fromEntries(shades.map(shade => [shade, "--theme-glow"]))),
        violet: semanticScale(Object.fromEntries(shades.map(shade => [shade, "--theme-glow"]))),
        theme: {
          bg: "rgb(var(--theme-bg) / <alpha-value>)",
          surface: "rgb(var(--theme-surface) / <alpha-value>)",
          raised: "rgb(var(--theme-raised) / <alpha-value>)",
          input: "rgb(var(--theme-input) / <alpha-value>)",
          text: "rgb(var(--theme-text) / <alpha-value>)",
          "text-strong": "rgb(var(--theme-text-strong) / <alpha-value>)",
          muted: "rgb(var(--theme-muted) / <alpha-value>)",
          border: "rgb(var(--theme-border) / <alpha-value>)",
          accent: "rgb(var(--theme-accent) / <alpha-value>)",
          "accent-light": "rgb(var(--theme-accent-light) / <alpha-value>)",
          "accent-text": "rgb(var(--theme-accent-text) / <alpha-value>)",
          "on-accent": "rgb(var(--theme-on-accent) / <alpha-value>)",
          overlay: "rgb(var(--theme-overlay) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
}

