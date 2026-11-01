# InspirQ UI/UX Audit and Remediation

## Scope

The audit covered the public landing and discovery experience plus Player, Venue Owner, Coach, Organiser, and Admin workspaces. It reviewed shared shells, navigation, cards, tables, forms, dialogs, status indicators, typography, colors, focus behavior, responsive layouts, and reduced-motion behavior.

## Resolved system issues

### Brand and color

- Energy Yellow (`#FFC400`) is the only primary brand surface.
- Performance Ink (`#17140A`) is used on yellow controls at an 11.52:1 contrast ratio.
- Accessible Brand Text (`#664D00`) replaces yellow for text on white at an 8.00:1 contrast ratio.
- Application chrome now uses a cool premium-neutral canvas, raised white surfaces, and restrained yellow emphasis inspired by native Apple and Microsoft interface conventions.
- Success, warning, destructive, and information states use dedicated semantic green, amber, red, and blue scales rather than reusing brand colors.
- Residual emerald and green utility colors were removed from rendered application code.
- Former green-biased secondary and warm-neutral scales were replaced by cool platform-neutral and fluent slate scales.
- The in-app design-system reference now documents the implemented palette rather than the superseded emerald system.

### Typography

- Native system typography uses San Francisco on Apple platforms and Segoe UI Variable on Windows, with system fallbacks elsewhere.
- External font requests were removed to eliminate loading shifts, certificate failures, and inconsistent fallback states.
- Headings and display values use tighter native display tracking while body copy preserves comfortable platform-standard spacing.
- Text below 12px was removed from active application UI.
- Heading weights, line heights, and tracking now follow one global hierarchy.

### Components and interaction

- Shared buttons, inputs, selection controls, cards, tabs, tables, and badges consume the semantic token contract.
- Shared controls now use a 40–44px size scale, consistent 10–16px radii, subtle control shadows, and layered card/overlay elevation.
- Legacy utility colors are bridged through exact class-token selectors, avoiding the unsafe substring matching that previously recolored hover states.
- Interactive controls have visible keyboard focus indicators.
- Icon-only actions have accessible names and larger touch targets.
- Inputs and shared buttons meet a minimum 40px control height.
- Yellow surfaces always use dark ink instead of low-contrast white.
- Reduced-motion preferences disable nonessential transitions and animation.

### Layout and responsive behavior

- Role workspaces now share one 72px header, consistent sidebar, canvas, page spacing, and elevation model.
- Active navigation uses a full Energy Yellow state with dark text and `aria-current`.
- Workspace headers expose role and current-page context.
- Mobile workspace padding is normalized and horizontal overflow is contained.
- Dialogs use viewport-safe maximum heights with internal scrolling.
- Tables keep responsive overflow, visible headers, row hover feedback, filtering, sorting, and CSV download.

### Flow and usability

- Player authentication restores the correct dashboard and guards against invalid page state.
- Public pages render immediately while session restoration continues asynchronously, so a stalled session request cannot block the landing experience.
- Browser validation at desktop and mobile widths confirmed the landing hierarchy, contrast, responsive search flow, and navigation.
- Landing photography uses bundled sports assets instead of failure-prone remote image requests, preventing empty hero, offer, and discovery cards.
- Venue, tournament, coach, commerce, detail, and operational screens now share bundled media and local fallback illustrations instead of depending on remote image hosts.
- The live-activity ticker preserves each message as a non-shrinking item in a horizontally scrollable viewport rather than compressing or overlapping text.
- Carousel, gallery, favorite, rating, notification, profile, and navigation icon controls expose accessible names, state, and touch-friendly targets.
- Tournament and Coach discovery use the same grid/list behavior as Arena discovery.
- Empty states, loading feedback, selection states, availability, and status labels remain explicit and do not depend on color alone.
- Public and role navigation use consistent naming and interaction feedback.

## Accessibility contrast reference

| Pair | Ratio |
| --- | ---: |
| Performance Ink on Energy Yellow | 11.52:1 |
| Accessible Brand Text on white | 8.00:1 |
| Muted body text on white | 7.69:1 |
| Subtle text on white | 4.97:1 |
| Success text on success tint | 7.26:1 |
| Warning text on warning tint | 9.05:1 |
| Destructive text on destructive tint | 7.97:1 |
| Information text on information tint | 7.62:1 |
| Primary text on application canvas | 16.41:1 |

All listed pairs meet WCAG AA for normal text.
