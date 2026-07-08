# Claude Code work order — Bask For Business 3D rebuild

Paste this into Claude Code from the root of the Bask For Business Next.js repo. Two files ride along with it: `bask-DESIGN.md` (the look spec) and `bask-3d-dot-ripple.html` (the working reference for the signature graphic and the section copy). Drop both in the repo root before starting so the agent can read them.

---

## Prompt to paste

```
You are working in the Bask For Business Next.js repo. Read bask-DESIGN.md and bask-3d-dot-ripple.html in the repo root before writing anything. They are the source of truth for look, color, copy, and the 3D graphic behavior. Follow bask-DESIGN.md exactly for palette and type.

GOAL
Rebuild the homepage around a single scroll-scrubbed 3D signature graphic, and implement the eight tasks below. This is a ground up homepage rebuild, not a redesign of the palette. Keep the navy #050D30 and pink #FA0F4B brand exactly.

HARD RULES
1. No dashes anywhere in user facing copy. Use commas, colons, parentheses, or separate sentences. Dashes are allowed only inside code and code comments.
2. Complete file replacements for every component you create or change, never partial snippets.
3. State the target file path and the intended structural change before each edit. If a path is uncertain, locate the component in the repo first and confirm.
4. Do not restyle the brand palette. Do not rebuild working sections from scratch where the existing one is close, improve in place.
5. Any fact, number, or quote that is not confirmed must appear as a [[NEEDS INPUT: short description]] token, never as a plausible looking made up figure. At the end, report the full list of tokens.

THE SIGNATURE GRAPHIC (build this as real React Three Fiber, do not copy any third party tool output)
Architecture, matching the reference behavior:
- One <Canvas> from @react-three/fiber, position fixed, full viewport, z-index behind all content, pointer-events none.
- A field of small points arranged in concentric rings (see bask-3d-dot-ripple.html for the ring generation and even spacing logic). Roughly 6000 to 9000 points on desktop, fewer on mobile.
- Motion is one continuous timeline driven by scroll progress from 0 to 1, read once per frame, NOT clips firing at breakpoints. Ambient time drives the base ripple, scroll modulates wave frequency, amplitude, dome tilt, rotation, and camera pull. Port the updateField math from the prototype.
- For production performance, compute the ripple in a custom vertex shader with two uniforms: uTime and uScroll. Do not update 9000 positions in JS per frame. Pass scroll progress into uScroll from a small zustand store or a shared ref updated by a passive scroll listener.
- Colors: cool navy blue points, a pink #FA0F4B bloom near center, occasional pale sparkle points. Additive blending on the navy background.

ACCESSIBILITY AND MOBILE FLOOR (Task 8, mandatory)
- prefers-reduced-motion: reduce renders a single static frame, no animation loop.
- Narrow viewport (< 760px): lower point count, lighter or slower motion, must stay smooth. Over half of B2B research is on phones.
- The canvas only reads scroll, it never intercepts, hijacks, or traps it. Verify the page scrolls normally on a phone width viewport before calling this done.

TASKS, top to bottom by leverage
Task 1, hero: live text <h1> and subhead, not baked into any image. Use the exact hero copy from bask-3d-dot-ripple.html. One primary CTA. One secondary text link that does not compete.
Task 7, crawlable text: confirm the headline and tagline are live DOM text. If any wordmark or tagline is currently part of a hero background image, move it to live text over the graphic. Ensure one real <h1>, a descriptive <title>, and a meta description that name the service and the buyer in plain language, so the page is citable when someone asks an AI who does managed IT for small businesses that supports GoDaddy.
Task 2, proof strip: new section directly under the hero, on the off white panel. Four stat slots (years in business, businesses supported, average response time, resolution rate) and a partner badge row that includes GoDaddy and Nano Heal. Every figure and quote as a [[NEEDS INPUT: ...]] token. Build a testimonials component with room for two or three quotes, also tokenized. Confirm logo usage rights before shipping any real logo image.
Task 3, pricing and objections: new section after the two path section. Plain language fixed monthly fee message, recover the no surprise call out charges strength from the older business.bask.com site. Honest one or two sentence answers to is there a long contract and what happens when we switch. Use [[NEEDS INPUT: price or range]] for any unconfirmed number.
Task 4, primary CTA: standardize one specific low friction label used everywhere. Use Book a 15 minute IT assessment. Point every primary CTA at the existing consultation booking widget. Demote any competing buttons to secondary.
Task 5, two path section: keep and improve the existing Core Support vs Managed IT section. Label Core Support as the SMB helpdesk tier and Managed IT as the SMB+ full MSP tier, plain buyer language on the surface with the SMB and SMB+ names supporting it. Name Nano Heal as the software behind proactive monitoring under Managed IT. One clear next step per card.
Task 6, what we handle cards: rewrite the monitor, updates, endpoints, backups cards so each names a concrete thing and a concrete payoff, attributing proactive work to Nano Heal where accurate. Use the card copy in bask-3d-dot-ripple.html as the baseline. No sentence that could sit unchanged on a competitor site.

DEFINITION OF DONE
- Hero states who, what, and the next step in live text within ten seconds.
- Proof section exists with real data or clearly tagged placeholders, nothing fabricated.
- Pricing and objections answered on the page.
- One specific primary CTA used consistently, pointed at the booking flow.
- Two tiers legible as helpdesk (SMB) vs full MSP (SMB+), at least one real capability named (Nano Heal, GoDaddy).
- No user facing sentence is generic enough to belong on a competitor site.
- No dashes in any copy.
- Page scrolls cleanly on mobile, reduced motion respected.
- Every unresolved fact is a [[NEEDS INPUT: ...]] token.

REPORT BACK
Summary only, do not paste full files unless I ask. For each task: what changed and which files were touched. Then the full list of outstanding [[NEEDS INPUT: ...]] tokens so the client knows exactly what to supply.
```

---

## What to have ready before you run it

- The repo cloned locally, `npm install` done, `npm run dev` working.
- `@react-three/fiber` and `@react-three/drei` and `three` installed. If they are not: `npm install three @react-three/fiber @react-three/drei`.
- `bask-DESIGN.md` and `bask-3d-dot-ripple.html` sitting in the repo root.

## The [[NEEDS INPUT]] list to send the client in parallel

You can chase these while the agent builds, they are the only things blocking a real launch:

- Target vertical or buyer: general small business, or a lean (retail, medical, legal, professional offices)
- Years in business
- Businesses supported
- Average response time
- Resolution rate
- Partner or certification badges beyond GoDaddy
- Two or three client testimonials: name, business, one or two sentences
- Starting price or price range
- Contract terms in plain language
