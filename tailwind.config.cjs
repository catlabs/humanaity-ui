/** @type {import('tailwindcss').Config} */
function withAlpha(variable) {
  return ({ opacityValue } = {}) => {
    const alpha = opacityValue ?? 1;
    // Enables utilities like `bg-primary/50` while sourcing the color from Material tokens.
    return `rgb(from ${variable} r g b / ${alpha})`;
  };
}

module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: 'class',
  corePlugins: {
    preflight: false // Disable Tailwind's base styles to prevent interference with Angular Material
  },
  theme: {
    extend: {
      colors: {
        // Material v3 system tokens (single source of truth).
        primary: withAlpha('var(--mat-sys-primary)'),
        onPrimary: withAlpha('var(--mat-sys-on-primary)'),
        primaryContainer: withAlpha('var(--mat-sys-primary-container)'),
        onPrimaryContainer: withAlpha('var(--mat-sys-on-primary-container)'),

        secondary: withAlpha('var(--mat-sys-secondary)'),
        onSecondary: withAlpha('var(--mat-sys-on-secondary)'),
        secondaryContainer: withAlpha('var(--mat-sys-secondary-container)'),
        onSecondaryContainer: withAlpha('var(--mat-sys-on-secondary-container)'),

        tertiary: withAlpha('var(--mat-sys-tertiary)'),
        onTertiary: withAlpha('var(--mat-sys-on-tertiary)'),
        tertiaryContainer: withAlpha('var(--mat-sys-tertiary-container)'),
        onTertiaryContainer: withAlpha('var(--mat-sys-on-tertiary-container)'),

        error: withAlpha('var(--mat-sys-error)'),
        onError: withAlpha('var(--mat-sys-on-error)'),
        errorContainer: withAlpha('var(--mat-sys-error-container)'),
        onErrorContainer: withAlpha('var(--mat-sys-on-error-container)'),

        surface: withAlpha('var(--mat-sys-surface)'),
        onSurface: withAlpha('var(--mat-sys-on-surface)'),
        surfaceVariant: withAlpha('var(--mat-sys-surface-variant)'),
        onSurfaceVariant: withAlpha('var(--mat-sys-on-surface-variant)'),

        outline: withAlpha('var(--mat-sys-outline)'),
        outlineVariant: withAlpha('var(--mat-sys-outline-variant)'),

        inverseSurface: withAlpha('var(--mat-sys-inverse-surface)'),
        inverseOnSurface: withAlpha('var(--mat-sys-inverse-on-surface)'),
        inversePrimary: withAlpha('var(--mat-sys-inverse-primary)'),

        surfaceContainerLowest: withAlpha('var(--mat-sys-surface-container-lowest)'),
        surfaceContainerLow: withAlpha('var(--mat-sys-surface-container-low)'),
        surfaceContainer: withAlpha('var(--mat-sys-surface-container)'),
        surfaceContainerHigh: withAlpha('var(--mat-sys-surface-container-high)'),
        surfaceContainerHighest: withAlpha('var(--mat-sys-surface-container-highest)'),
      }
    }
  },
  plugins: []
};
