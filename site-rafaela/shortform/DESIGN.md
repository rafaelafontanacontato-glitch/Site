# DESIGN.md · /shortform/

Direction: a dark editing-room stage where the vertical videos are the loudest thing on the page. The type stays the same family as the cinema site (Antonio caps for display), so both pages feel like one person. One hot accent, borrowed from the REC light of a camera, marks what is playing and what you can act on.

Note: this direction was chosen from the existing site and the brief ("chamar atenção, ênfase nos verticais"), not from a comparison with real reference sites (UXKIN was not connected).

## Color

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0e0e0d` | Main background (hero, verticals, contact) |
| `--ink-2` | `#181816` | Raised surfaces on dark: cards, chips, dialog |
| `--paper` | `#ece9e1` | Text on dark; background of the light sections (wide formats, about) |
| `--paper-2` | `#dedbd2` | Raised surfaces on light |
| `--mute` | `#9a978f` | Secondary text on dark (contrast 6.6:1 on ink) |
| `--mute-light` | `#5f5d57` | Secondary text on light (5.6:1 on paper) |
| `--rec` | `#ff4a1c` | Accent: REC dot, active chip, focus ring, hover on links. Never body text on paper |
| `--line` | `rgba(236,233,225,.14)` | Borders on dark |
| `--line-light` | `rgba(14,14,13,.16)` | Borders on light |

The page is always dark-first; there is no separate dark mode. Text on `--rec` uses `--ink`.

## Typography

- Display: **Antonio** 600, uppercase, tight leading (0.86 to 0.95). Headings and the hero name.
- Body: **Manrope** 400/500, 16px base, line-height 1.55, max 62ch.
- Labels: **DM Mono** 400/500, 11 to 12px, uppercase, letter-spacing .08em. Indexes, durations, chips, nav.

Scale (clamp, mobile → desktop): 12 · 14 · 16 · 20 · 28→40 · 44→88 · 72→200 (hero).

## Spacing

8px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144. Side gutter `clamp(16px, 4vw, 56px)`. Sections `clamp(72px, 11vw, 160px)` top and bottom. Max content width 1440px.

## Shape and depth

- Radius: 4 (chips inner), 14 (vertical cards, like a phone screen), 22 (hero phones), 999 (chips, buttons).
- No drop shadows on dark. One shadow for the hero phones: `0 30px 80px rgba(0,0,0,.55)`.

## Components

- **Chip** (filters): mono label + count, pill, `--ink-2` bg; active = `--paper` bg + `--ink` text with REC dot. Focus = 2px `--rec` ring.
- **Vertical card**: 9:16, radius 14, poster first, muted preview loop plays when the card is on screen (hover on pointer devices if the visitor prefers reduced motion). Top: index + duration. Bottom: title + format over a dark fade. Playing state shows a pulsing REC dot.
- **Wide card**: 16:9, radius 6, poster + hover preview, caption below in the light section.
- **Player dialog**: full-screen dark, 9:16 or 16:9 video with sound and controls, prev/next for the verticals (arrows on keyboard), counter `03 / 11`, close with Esc.
- **Button primary**: pill, `--rec` bg, `--ink` text. Quiet: underline on hover.
- **Marquee**: one line of services in Antonio, scrolls slowly; stops for reduced motion.

## Imagery

The video posters and loops are the only imagery. No stock photos, no icons other than text arrows (↗ ← →) and the REC dot. The portrait of Rafaela is reused from `../assets/retrato-rafaela.jpg`.

## Avoid

Gradients as decoration, glass blur, identical feature cards, emoji, the 3D computer.
