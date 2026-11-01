# FORGE D → Inspirq Sport --- Light Theme Foundation Color Tokens

Production-ready light-theme color foundation derived from the FORGE D
website brand palette for the Inspirq Sport SaaS application.

## 1. Brand anchors

  Token             HEX         Role
  ----------------- ----------- -----------------------
  `brand.energyYellow`   `#F5C518`   Primary brand energy yellow
  `brand.performanceBlue`     `#1473E6`   Secondary green
  `brand.lime`      `#C5A46D`   Achievement accent
  `brand.canvas`    `#F7F7F3`   Main light background
  `brand.surface`   `#FFFFFF`   Surface/card
  `brand.ink`       `#151713`   Strongest text
  `brand.body`      `#222520`   Body text
  `brand.muted`     `#5F635C`   Secondary/muted text

The FORGE D source palette establishes the energy yellow, performance blue,
lime highlight, light canvas, white panel, near-black heading, body and
muted relationships. fileciteturn3file0L9-L25

## 2. Primary --- Energy Yellow

Centered on FORGE D primary `#F5C518`.

  Token                 HEX
  --------------------- -----------
  `color.primary.50`    `#FFF9D6`
  `color.primary.100`   `#FFF0A3`
  `color.primary.200`   `#F7DD68`
  `color.primary.300`   `#EBC43F`
  `color.primary.400`   `#D3A514`
  `color.primary.500`   `#F5C518`
  `color.primary.600`   `#D9A900`
  `color.primary.700`   `#B88A00`
  `color.primary.800`   `#8F6B00`
  `color.primary.900`   `#5E4700`
  `color.primary.950`   `#2A2000`

``` css
:root {
  --color-primary-50: #FFF9D6;
  --color-primary-100: #FFF0A3;
  --color-primary-200: #F7DD68;
  --color-primary-300: #EBC43F;
  --color-primary-400: #D3A514;
  --color-primary-500: #F5C518;
  --color-primary-600: #D9A900;
  --color-primary-700: #B88A00;
  --color-primary-800: #8F6B00;
  --color-primary-900: #5E4700;
  --color-primary-950: #2A2000;
}
```

## 3. Secondary / Schematic --- Green

Use the FORGE D green `#1473E6` as the secondary family.

  Token                   HEX
  ----------------------- -----------
  `color.secondary.50`    `#EDF8F1`
  `color.secondary.100`   `#DCF1E3`
  `color.secondary.200`   `#B9E3C7`
  `color.secondary.300`   `#8FD0A5`
  `color.secondary.400`   `#65BC85`
  `color.secondary.500`   `#1473E6`
  `color.secondary.600`   `#398F5E`
  `color.secondary.700`   `#2F754E`
  `color.secondary.800`   `#255D3E`
  `color.secondary.900`   `#1B4630`
  `color.secondary.950`   `#102F20`

``` css
:root {
  --color-secondary-50: #EDF8F1;
  --color-secondary-100: #DCF1E3;
  --color-secondary-200: #B9E3C7;
  --color-secondary-300: #8FD0A5;
  --color-secondary-400: #65BC85;
  --color-secondary-500: #1473E6;
  --color-secondary-600: #398F5E;
  --color-secondary-700: #2F754E;
  --color-secondary-800: #255D3E;
  --color-secondary-900: #1B4630;
  --color-secondary-950: #102F20;
}
```

## 4. Highlight --- Lime

Use `#C5A46D` sparingly for energy, achievements and emphasis.

  Token                   HEX
  ----------------------- -----------
  `color.highlight.50`    `#F5FBEF`
  `color.highlight.100`   `#EAF7DE`
  `color.highlight.200`   `#D5EFBF`
  `color.highlight.300`   `#BFE69F`
  `color.highlight.400`   `#B0E487`
  `color.highlight.500`   `#C5A46D`
  `color.highlight.600`   `#91C965`
  `color.highlight.700`   `#73A94F`
  `color.highlight.800`   `#557D3B`
  `color.highlight.900`   `#3B5B2B`
  `color.highlight.950`   `#263D1D`

## 5. Neutral

The neutral family is intentionally warm-neutral to preserve the FORGE D
visual DNA.

  Token                 HEX
  --------------------- -----------
  `color.neutral.0`     `#FFFFFF`
  `color.neutral.50`    `#F7F7F3`
  `color.neutral.100`   `#EFEFE9`
  `color.neutral.200`   `#DFE0D8`
  `color.neutral.300`   `#C9CBC2`
  `color.neutral.400`   `#A5A89E`
  `color.neutral.500`   `#7D8178`
  `color.neutral.600`   `#5F635C`
  `color.neutral.700`   `#464A45`
  `color.neutral.800`   `#30342F`
  `color.neutral.900`   `#222520`
  `color.neutral.950`   `#151713`

``` css
:root {
  --color-neutral-0: #FFFFFF;
  --color-neutral-50: #F7F7F3;
  --color-neutral-100: #EFEFE9;
  --color-neutral-200: #DFE0D8;
  --color-neutral-300: #C9CBC2;
  --color-neutral-400: #A5A89E;
  --color-neutral-500: #7D8178;
  --color-neutral-600: #5F635C;
  --color-neutral-700: #464A45;
  --color-neutral-800: #30342F;
  --color-neutral-900: #222520;
  --color-neutral-950: #151713;
}
```

## 6. Semantic tokens

Components should consume semantic tokens rather than raw HEX values.

### Background

``` css
:root {
  --color-bg-page: var(--color-neutral-50);
  --color-bg-subtle: var(--color-neutral-100);
  --color-bg-surface: var(--color-neutral-0);
  --color-bg-surface-raised: var(--color-neutral-0);
  --color-bg-primary-soft: var(--color-primary-50);
  --color-bg-secondary-soft: var(--color-secondary-50);
  --color-bg-highlight-soft: var(--color-highlight-100);
}
```

### Text

``` css
:root {
  --color-text-brand-text: var(--color-neutral-950);
  --color-text-body: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-700);
  --color-text-muted: var(--color-neutral-600);
  --color-text-placeholder: var(--color-neutral-500);
  --color-text-disabled: var(--color-neutral-400);
  --color-text-on-primary: #FFFFFF;
  --color-text-on-secondary: #FFFFFF;
}
```

### Interactive

``` css
:root {
  --color-action-primary: var(--color-primary-500);
  --color-action-primary-hover: var(--color-primary-600);
  --color-action-primary-pressed: var(--color-primary-700);

  --color-action-secondary: var(--color-secondary-500);
  --color-action-secondary-hover: var(--color-secondary-600);
  --color-action-secondary-pressed: var(--color-secondary-700);

  --color-focus-ring: var(--color-primary-400);
  --color-selection: var(--color-primary-100);
}
```

### Borders

``` css
:root {
  --color-border-subtle: var(--color-neutral-200);
  --color-border-default: var(--color-neutral-300);
  --color-border-strong: var(--color-neutral-400);
  --color-border-primary: var(--color-primary-300);
}
```

## 7. System status colors

Keep system meaning separate from brand meaning.

``` css
:root {
  --color-success-500: #16804B;
  --color-success-bg: #EAF7EF;
  --color-success-text: #0E5C36;

  --color-warning-500: #B7791F;
  --color-warning-bg: #FFF6DF;
  --color-warning-text: #744A08;

  --color-error-500: #C63D3D;
  --color-error-bg: #FDECEC;
  --color-error-text: #8E2424;

  --color-info-500: #2D6FA8;
  --color-info-bg: #EAF3FA;
  --color-info-text: #20527C;
}
```

**Principle:** energy yellow means brand/action; success, warning, error and
information mean system state.

## 8. Inspirq Sport mapping

  UI                  Token
  ------------------- --------------------------------
  App background      `--color-bg-page`
  Cards               `--color-bg-surface`
  Primary CTA         `--color-action-primary`
  CTA hover           `--color-action-primary-hover`
  Secondary CTA       `--color-action-secondary`
  Page heading        `--color-text-brand-text`
  Body copy           `--color-text-body`
  Supporting copy     `--color-text-secondary`
  Metadata            `--color-text-muted`
  Input border        `--color-border-default`
  Input focus         `--color-focus-ring`
  Active navigation   `--color-action-primary`
  Selected card       `--color-bg-primary-soft`
  Achievement         `--color-highlight-500`
  Success             `--color-success-500`
  Warning             `--color-warning-500`
  Error               `--color-error-500`
  Information         `--color-info-500`

## 9. Sport-specific extension

``` css
:root {
  --sport-brand: var(--color-primary-500);
  --sport-brand-soft: var(--color-primary-50);
  --sport-performance: var(--color-secondary-500);
  --sport-achievement: var(--color-highlight-500);
  --sport-data-neutral: var(--color-neutral-600);

  --sport-success: var(--color-success-500);
  --sport-warning: var(--color-warning-500);
  --sport-error: var(--color-error-500);
}
```

For charts, leaderboards and analytics, do not use energy yellow for every
data series. Use a dedicated visualization palette so multiple metrics
remain distinguishable.

## 10. Token architecture

Use:

``` text
Foundation
    ↓
Semantic
    ↓
Component
```

Example:

``` text
color.primary.500
      ↓
color.action.primary
      ↓
button.primary.background
```

This lets Inspirq Sport evolve independently while retaining the FORGE D
visual DNA.

## 11. Core palette

  Purpose              HEX
  -------------------- -----------
  Primary Energy Yellow      `#F5C518`
  Performance Blue      `#1473E6`
  Achievement Champagne       `#C5A46D`
  Page Background      `#F7F7F3`
  Surface              `#FFFFFF`
  Primary Text / Ink   `#151713`
  Body Text            `#222520`
  Muted Text           `#5F635C`
  Border               `#DFE0D8`

## Final design principle

**FORGE D supplies the visual DNA. Semantic tokens give Inspirq Sport
its own product language.**

Use the brand palette as the foundation, but build sport-specific
components, analytics, charts and interaction patterns independently on
top of it.
