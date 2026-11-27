export const APP_THEMES = [
    { value: "auto", label: "Auto" },
    { value: "night", label: "Mitternacht" },
    { value: "light", label: "Hell" },
    { value: "forest", label: "Wald" },
    { value: "gold", label: "Gold" },
    { value: "sea", label: "Sea" },
    { value: "rose", label: "Rose" },
] as const;

export type AppTheme = typeof APP_THEMES[number]["value"];

export const isAppTheme = (value: string | null): value is AppTheme =>
    APP_THEMES.some(theme => theme.value === value);
