# TekOps Backprop-style Redesign — Implementation Spec

Goal: restyle the WHOLE TekOps site to match the aesthetic of backprop.site, but KEEP the TekOps emerald→lime green brand as the accent/CTA color, and KEEP the existing dark/light theme toggle working. Dark mode = the backprop look. Light mode must still look clean and intentional.

This is a RESTYLE only. Do NOT change any app logic, routing, data, AI interview/grader behavior, progress store, or component props/exports. Only change className/markup/visual structure. Do not rename files. Do not touch `api/`, `src/lib/ai.ts`, `src/store/`, `src/data/`.

## Hard brand rules (binding, do not violate)
- Brand gradient: `linear-gradient(135deg, #10b981, #84cc16)` (emerald-500 → lime-500). Use the existing `gradient-bg` / `gradient-text` classes and `text-accent` (#10b981).
- NO emdashes anywhere in copy. Use commas or restructure. (En-dash `–` and middot `·` are fine but in JSX text a bare `·` must be inside `{'...'}` braces.)
- No fake numbers / no fabricated learner counts. Use community / non-numeric framing. The site already follows this — keep it. If a stat is real (e.g. "95 topics", "62+ questions", "22 projects" from the data files) it is fine to show; do not invent engagement metrics like "3000+ learners".
- Use real Unicode apostrophes/quotes in strings: `\u2019`, `\u201c`, `\u201d`.

## Design system already in place (USE THESE — do not reinvent)
Defined in `src/index.css` and `src/components/ui.tsx`:
- `.glass` — translucent card surface + hairline border, blurs. Auto-adapts per theme (glass on dark, opaque white card on light via the --card token).
- `<Glass>` component (from `../components/ui` / `../ui`) — wraps `.glass rounded-card`. Props: `as`, `className`, `hover`, plus normal div props. PREFER this over hand-rolled card divs.
- `<EyebrowPill>` component — small uppercase mono category marker in a rounded glass chip. Props: `dot` (static green dot), `live` (pulsing green presence dot), `className`. Use for section eyebrows like `<EyebrowPill live>Interview Prep</EyebrowPill>`.
- `.eyebrow-pill` raw class (same look) if you need an anchor/link instead of the component.
- `.hero-title` — fluid oversized tight headline (clamp 2.75rem→4.75rem, -0.045em). Use for the main hero H1.
- `.section-title` — fluid section heading (clamp 1.75rem→2.75rem, -0.035em). Use for each section's H2.
- `.nav-frost` — frosted translucent nav bar background + bottom hairline. Apply to the sticky top nav wrapper.
- `.live-dot` — pulsing green presence dot (used inside EyebrowPill live).
- `.marquee-track` + `.marquee-mask` + `.marquee-pause` — horizontal auto-scroll row. Duration via `style={{['--marquee-duration' as any]:'40s'}}`. Duplicate the children once (render the list twice back-to-back) so the -50% translate loops seamlessly.
- `.edge-fade-y` — vignette overlay that fades to page color top & bottom (for hero backdrop).
- `Button` variants (from ui): `primary` (green gradient pill — main CTA), `light` (neutral glass pill — secondary), `dark` (translucent over imagery), `ghost`. All buttons are now fully rounded pills.
- Color tokens (Tailwind): `bg-page`, `bg-card`, `bg-card-2`, `border-line`, `text-fg`, `text-fg-muted`, `text-fg-faint`, `text-accent`, `bg-accent`, `rounded-card`, `rounded-btn`, `shadow-glow-sm`.
- Dark theme is applied via `[data-content-theme='dark']` on a wrapper (managed by `src/store/theme.tsx`). The dark page already has a fixed faint dot-grid background globally — do NOT add another full-page dot grid; section-level `.hero-grid` is fine for a hero panel only.

## Backprop layout characteristics to apply site-wide
- Pure black dark theme (already set: --page #0a0a0a), white headlines, lots of negative space.
- Oversized, very tight hero headline (use `.hero-title`). Multi-line headline is good (backprop stacks 3 lines).
- Eyebrow pill ABOVE most section titles and the hero (uppercase mono, glass chip, often a leading dot).
- Glass cards with hairline borders, NO heavy drop shadows on dark. Corner radius: cards use `rounded-card` (20px), buttons/badges fully rounded pills.
- Centered, symmetrical content. Max content width ~1200px (`max-w-6xl mx-auto px-...`). Generous vertical section padding (e.g. `py-20 sm:py-28`).
- Bento/asymmetric feature grid for the "everything you need" style section (one large card + smaller cards) where it fits.
- A horizontal auto-scrolling proof/marquee row is on-brand IF there is real content to show (e.g. the track names, topic tags, or tech logos). Do NOT fabricate testimonials. A marquee of the 14 track names or tech topics is a good, honest use.
- Keep green as the accent: live dots, primary CTA, progress rings/bars, active chips, icon tiles all stay green gradient.

## Light mode
Keep it clean and readable. The tokens already swap (light surfaces, dark text). Just make sure: text contrast is good, the glass cards become solid white cards (they do via --card), the dot-grid bg does NOT show in light mode (it is gated to dark only — keep it that way), and nothing relies on white-on-white. The same components should look intentional in light mode.

## Files to restyle (in priority order)
1. `src/pages/Roadmap.tsx` — this is the HOME/landing page. Give it the backprop treatment: eyebrow pill + big `.hero-title` hero with subhead and primary CTA (Start the roadmap) + secondary (Interview prep), an honest stats strip (real numbers from data: topics/projects/questions/tracks), the existing roadmap track sections restyled as glass cards, optional marquee of track names. Preserve all existing functionality, links, and the progress logic.
2. `src/components/Nav.tsx` and/or `src/components/DarkHeader.tsx` — frosted sticky nav (`.nav-frost`), logo left, links center/left, theme toggle + level badge right. Pills for any buttons.
3. `src/components/Footer.tsx` — minimal dark footer, hairline top border, logo + tagline + nav columns. Keep it understated like backprop.
4. `src/pages/Interview.tsx` — eyebrow pill + section title hero ("Practice for real, with AI"), glass cards for the Mock vs Quick choice, restyle the question-bank grid as glass cards. The Mock/Quick scorecard internals were just rebuilt and WORK — only update their card chrome to glass/pills, do not change the per-question review logic, the support card, or scoring.
5. `src/components/cards.tsx` — restyle track/topic cards to glass with hairline borders, keep the hover-peek behavior and rec ('start') styling. Keep green status colors.
6. `src/pages/Projects.tsx`, `src/pages/ProjectDetail.tsx`, `src/pages/TopicDetail.tsx`, `src/pages/Dashboard.tsx`, `src/pages/NotFound.tsx` — apply the same glass-card + eyebrow-pill + section-title language. Dashboard stat cards = glass with green accents.
7. `src/components/QuestionCard.tsx`, `src/components/ai/MockInterview.tsx`, `src/components/ai/QuickPractice.tsx`, `src/components/ai/ScoreMeter.tsx` — chrome only: swap ad-hoc card divs for glass, ensure buttons are pills, keep all behavior.

## Constraints / cautions
- Build must pass: `npm run build` (tsc + vite). Run it yourself and fix any type errors you introduce.
- Do NOT change exported component names or their props (other files import them).
- Do NOT remove the theme toggle or break `data-content-theme`.
- Keep all `data-testid`s if present.
- The MockInterview scorecard already has: per-question Review section, "How a strong answer sounds" model answers, covered/missing chips, and a PayPal "Support TekOps" card with placeholder link `https://paypal.me/yourname` and a swap comment. DO NOT remove or alter these — only restyle their containers to match.
- After your edits, run `npm run build` and confirm it succeeds. Report the final JS/CSS bundle names.

Do excellent, restrained, premium work. Match backprop's confidence: type does the heavy lifting, glass + hairlines, green only as the accent.
