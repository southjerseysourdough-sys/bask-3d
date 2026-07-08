# Bask For Business — Style Reference

> One team, fewer surprises. A calm control room in navy and pink.

**Theme:** dark

Bask For Business runs on a deep navy substrate (#050D30) that reads like a well run server room at night: quiet, dark, in control, nothing blinking that should not be. Against that ground sits one decisive pink (#FA0F4B), used the way a good MSP uses an alert, sparingly and only when it means something. Pink is reserved almost entirely for the primary action (Book a 15 minute IT assessment) and for the small eyebrow labels that name a section. It is a flashlight, not a highlighter. When a section needs to breathe or carry proof, the page steps onto an off white panel (#F9F9FB) with dark ink text, a deliberate exhale between the dark hero and the dark service sections. Structure is carried by hairline borders and soft translucent card lifts rather than heavy shadows, so the geometry does the work. Type weights stay confident but never shouty. The whole page should feel like the product it sells: steady, plain spoken, no surprises.

## Color

| Role | Hex | Notes |
|---|---|---|
| Background, primary | `#050D30` | navy substrate, most of the page |
| Surface lift, navy | `#0B1B52` | slightly lighter navy for the pricing card and depth |
| Accent, primary | `#FA0F4B` | pink. CTAs, eyebrows, the one 3D key light. Never as body text on navy for long runs. |
| Panel, light | `#F9F9FB` | off white breathing sections (proof, pricing intro) |
| Ink, on light | `#2B2B2B` | body text on the off white panels |
| Text, on navy | `#FFFFFF` at 100 / 82 / 70 percent | headings full, body ~82, secondary ~70 |
| Hairline | `rgba(255,255,255,.12 to .15)` | card borders on navy, no drop shadows |

Rule of restraint: if a screen has more than one pink element competing for the eye, one of them is wrong. The primary CTA always wins.

## Typography

- **Display / headings:** Manrope, weights 700 to 800, letter tracking tightened to about -0.02em. Geometric and rounded, it echoes the confidence of the existing bask wordmark without going stiff.
- **Body:** Inter, weight 400 to 500, normal tracking, line height ~1.55 for reading comfort.
- **Utility / eyebrow / data labels:** Inter or Manrope at 12 to 13px, weight 700, uppercase, letter tracking widened to about .14em, colored pink for eyebrows and muted white for data labels.
- Type scale (fluid): h1 clamp(34px, 5.4vw, 64px), h2 clamp(26px, 3.6vw, 42px), h3 24px, body 15 to 19px.

Load both via `next/font` (Manrope and Inter are on Google Fonts) so there is no layout shift and no extra request in the Next.js build.

## Layout and components

- Full width sections, generous vertical rhythm (about 90 to 110px top and bottom padding), horizontal gutter around 8vw.
- Cards on navy: translucent fill `rgba(255,255,255,.04 to .05)`, 1px hairline border, 14 to 18px radius, light backdrop blur. No box shadows on dark. Shadows only appear under the pink CTA, as a colored glow, to pull the eye to the one action that matters.
- Cards on the off white panel: white fill, 1px `#e7e7ee` border, matching radius. Same discipline, inverted.
- Structural markers (SMB, SMB+, eyebrows) encode real information: the tier a card belongs to, the job a section does. No decorative 01 / 02 / 03 numbering unless a section is genuinely a sequence.
- One primary button style only. Everything else is a secondary text link with an underline offset. Never two primary buttons side by side.

## Signature element

A fixed, full viewport field of small dots arranged in concentric rings behind all content, rippling outward like a slow radar sweep. It is the visual language of monitoring and uptime, which is literally what Bask sells. It is scroll scrubbed: one continuous timeline from 0 to 1 driven by scroll position, not a set of clips that fire at breakpoints. The ripple swells broad and slow in the hero, tightens and quickens through the middle of the page, and calms near the closing call to action. Colors run cool navy blue with a pink bloom near the center and occasional pale sparkles. This is the one place the page spends its boldness. Everything else stays quiet so this can be the thing people remember.

## Motion and accessibility floor

- The dot field reads live scroll once per frame and never writes to scroll. It cannot hijack, trap, or stutter the page. Scrolling always behaves normally.
- `prefers-reduced-motion: reduce` freezes the field to a single static frame, no animation loop.
- On narrow (mobile) viewports the point count drops and the field renders a lighter static or slow ambient version, so phones stay smooth. Over half of B2B research is on phones, this is not optional.
- Visible keyboard focus on every interactive element. Real `<h1>`, descriptive `<title>` and meta description in live crawlable text, never baked into an image.

## Voice

Calm, plain, specific. Name the real thing: Nano Heal for monitoring, GoDaddy for platform support, fixed monthly fee for pricing. No sentence should be generic enough to sit unchanged on a competitor MSP site. Premium here means it converts, not that it sounds fancy. No dashes in body copy, ever.
