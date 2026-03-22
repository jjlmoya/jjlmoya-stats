# Linting Rules

## Project Standards

### File Structure Rules
- CSS must be in separate files in `src/styles/`
- Astro files must NOT contain `<style>` blocks
- Vue files must NOT contain inline `style=` attributes
- Maximum file length: 150 lines (excluding blank lines and comments)
- Maximum function length: 20 lines (excluding blank lines and comments)

### CSS Rules
- All colors MUST use CSS variables from `src/styles/theme.css`
- All font-family MUST use CSS variable `var(--font-family)` from theme.css
- No hardcoded colors (hex, rgb, hsl)
- No hardcoded font families
- Selector naming: BEM pattern (`block__element--modifier`)
- Custom properties naming: lowercase with hyphens (`--property-name`)

### Theme System
- Light and dark themes defined in `src/styles/theme.css`
- Themes use `@media (prefers-color-scheme: light/dark)`
- All theme colors use CSS custom properties
- All theme typography uses CSS custom properties

### Code Style Rules
- NO comments allowed (any language)
- NO emojis allowed (in code or strings)
- NO inline styles
- NO magic numbers or hardcoded values
- Maximum cyclomatic complexity: 10

### Tools
- ESLint with TypeScript support
- Stylelint with standard config
- Custom validation script for structural rules
- Astro ESLint parser for `.astro` files

### Running Linters

```bash
npm run lint        # Run all linters
npm run lint:js     # ESLint only
npm run lint:css    # Stylelint only
npm run lint:rules  # Custom validation rules
npm run lint:fix    # Auto-fix issues
```

### CSS Variables Reference

#### Typography
- `--font-family`
- `--font-size-xs`, `--font-size-sm`, `--font-size-base`, `--font-size-lg`, `--font-size-xl`, `--font-size-2xl`
- `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`

#### Spacing
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`, `--spacing-2xl`, `--spacing-3xl`

#### Border Radius
- `--border-radius-sm`, `--border-radius-md`, `--border-radius-lg`

#### Layout
- `--sidebar-width`
- `--header-height`

#### Colors (Dark Mode by default)
- `--color-bg`
- `--color-surface`
- `--color-surface-hover`
- `--color-border`
- `--color-text`
- `--color-text-muted`
- `--color-accent`, `--color-accent-hover`
- `--color-success`
- `--color-danger`

### File Naming Conventions
- Components: PascalCase (e.g., `StatCard.vue`)
- Styles: kebab-case (e.g., `stat-card.css`)
- Layouts: PascalCase (e.g., `DashboardLayout.astro`)
- Pages: kebab-case (e.g., `index.astro`)
