# DESIGN.md · /shortform/

Direction: editorial collage. A warm cream page where the vertical videos sit like printed photos taped onto a moodboard, with soft pink and lilac shapes behind them. Big serif headings with italic accents, like a magazine spread. It nods to Rafaela's collage illustration and keeps the videos as the brightest thing on the page.

Note: chosen from the brief ("chamar atenção, ênfase nos verticais", first dark/orange version felt too masculine), not from a comparison with reference sites (UXKIN not connected).

## Color

| Token | Value | Role |
|---|---|---|
| `--cream` | `#f5f0e8` | Page background |
| `--cream-2` | `#ece4d8` | Wide section band, empty media |
| `--paper` | `#fffdf9` | Photo frames (cards, hero phones, portrait), chips |
| `--plum` | `#2b1d2a` | Text, primary button, contact and player background |
| `--plum-soft` | `#6e5a6a` | Secondary text (5.9:1 on cream) |
| `--berry` | `#b03564` | Accent: italic words, indexes, links, focus ring (5.6:1 on cream) |
| `--pink` | `#f4c6d3` | Marquee band, hero blob, highlights on plum |
| `--lilac` | `#d8cdf3` | Active chip, hero circle, tape on portrait |
| `--butter` | `#f3e2a6` | Tape on hero phones, service tag |

## Typography

- Display: **Instrument Serif** 400, roman + italic. Italic words carry the berry color.
- Body: **Manrope** 400, 16px, line-height 1.6.
- Labels: **DM Mono** 400, 11 to 12px, uppercase, letter-spacing .08em.

Scale: 11 · 12 · 16 · 20 · 26 · 42 · 52→116 (section) · 76→184 (hero).

## Spacing

8px base. Gutter `clamp(16px, 4vw, 56px)`, sections `clamp(72px, 10vw, 150px)`, max width 1600px.

## Shape and depth

- Photo frames: radius 6, white border 8px (bigger at the bottom for the caption), one shadow `--shadow`, tilt between -1.3 and 1.3deg that straightens on hover.
- Tape: translucent butter or lilac strip on top of frames.
- Pills (chips, buttons, tags): radius 999.

## Components

- Vertical card: printed photo with 9:16 video, index + duration on top, serif title and mono format below. Muted 5s preview plays when on screen.
- Chips: paper pill with italic count; active = lilac.
- Player: plum full screen, prev/next, arrows, swipe, Esc.
- Buttons: plum pill, berry on hover.

## Avoid

Neon or orange accents, dark-only pages, glass blur, emoji, gradients as decoration.
