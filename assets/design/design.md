
---
version: 1
name: Ember Pill Mobile
colors:
  primary: "#F37F46"
  on-primary: "#FFFFFF"
  surface: "#FFFFFF"
  surface-alt: "#F2F2F7"
  on-surface: "#000000"
  on-surface-variant: "#6C6C70"
  border: "#E5E5EA"
  success: "#34C759"
  error: "#FF3B30"
  warning: "#FF9500"
  accent-blue: "#007AFF"
  accent-indigo: "#5856D6"
  accent-yellow: "#F5C842"
typography:
  display-xl:
    fontFamily: Nunito Sans
    fontSize: 120px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 64px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.02em
  display-md:
    fontFamily: Nunito Sans
    fontSize: 48px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 30px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: 700
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: -0.01em
  numeral-stat:
    fontFamily: Nunito Sans
    fontSize: 30px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0em
  label-uppercase:
    fontFamily: Nunito Sans
    fontSize: 10px
    fontWeight: 800
    lineHeight: 14px
    letterSpacing: 0.08em
  tab-label:
    fontFamily: Nunito Sans
    fontSize: 10px
    fontWeight: 700
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 8px
  md: 14px
  lg: 16px
  xl: 24px
  2xl: 28px
  3xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  card-padding: 20px
  section-gap: 32px
icons:
  set: solar
  default_variant: bold
  active_variant: bold
  stroke_weight: n/a (filled glyphs)
  default_size: 24px
components:
  card:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card-padding}"
    border: none
    boxShadow: none
  card-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.3xl}"
    padding: "{spacing.lg}"
    border: none
    boxShadow: "0 10px 25px -5px rgba(243,127,70,0.20)"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-sm}"
    rounded: "{rounded.full}"
    paddingY: 20px
    paddingX: 24px
    border: none
    boxShadow: "0 12px 30px -8px rgba(243,127,70,0.25)"
  button-secondary:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-sm}"
    rounded: "{rounded.full}"
    paddingY: 20px
    paddingX: 24px
    border: none
    boxShadow: none
  button-text:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    paddingY: 0px
    paddingX: 0px
    gap: 4px
    border: none
    boxShadow: none
  button-icon:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    size: 40px
    iconSize: 24px
    border: none
    boxShadow: none
  input-text:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    paddingX: 18px
    paddingY: 14px
    border: none
    boxShadow: none
    focusRingColor: "{colors.primary}"
  chip:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    paddingX: 12px
    paddingY: 8px
    border: none
    boxShadow: none
  chip-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    paddingX: 12px
    paddingY: 8px
    border: none
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)"
  badge-pill:
    backgroundColor: "rgba(255,255,255,0.20)"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    paddingX: 12px
    paddingY: 6px
    border: none
    boxShadow: none
  badge-circle:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-uppercase}"
    rounded: "{rounded.full}"
    paddingX: 8px
    paddingY: 2px
    border: none
    boxShadow: none
  avatar:
    backgroundColor: "{colors.surface-alt}"
    rounded: "{rounded.full}"
    size: 40px
    border: none
    boxShadow: none
  list-row:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.2xl}"
    paddingX: 20px
    paddingY: 16px
    gap: 16px
    border: none
    boxShadow: none
  progress-bar:
    backgroundColor: "{colors.surface-alt}"
    rounded: "{rounded.full}"
    height: 8px
    border: none
    boxShadow: none
  top-app-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    height: 64px
    paddingX: "{spacing.gutter}"
    border: none
    boxShadow: none
  tab-bar:
    backgroundColor: "rgba(255,255,255,0.90)"
    rounded: "{rounded.full}"
    paddingX: 6px
    paddingY: 6px
    borderColor: "rgba(229,229,234,0.50)"
    borderWidth: 1px
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
  tab-item-active:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.primary}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.full}"
    paddingY: 12px
    iconSize: 24px
    border: none
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)"
  tab-item-inactive:
    backgroundColor: transparent
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.tab-label}"
    rounded: "{rounded.full}"
    paddingY: 12px
    iconSize: 24px
    border: none
    boxShadow: none
---

# Ember Pill Mobile

## Overview

**Bright, confident, and motivational.** A high-contrast white-canvas mobile aesthetic anchored by a single saturated ember-orange brand. The system feels energetic without being loud — it earns the energy through one large brand-saturated hero card per screen, surrounded by quiet pearl-grey tonal cards that recede into the background.

The personality is **modern, athletic, and rewarding**. Black ultra-bold numerals carry data; rounded-full pills carry actions and navigation; soft pearl-grey rectangles carry secondary stats. There are no hairline borders, no heavy shadows, no gradients on chrome — separation comes from tonal layering (white → pearl-grey → ember).

The aesthetic loves **roundness**: every corner is generously curved, every action is a fully-rounded pill, every icon sits inside a circular halo. The tab bar floats as a translucent capsule above the content. Numerals are oversized, ultra-black, and tightly tracked — the data is the hero.

## Colors

The palette runs in three tiers:

- **Chrome surfaces** — `{colors.surface}` pure white as the page canvas; `{colors.surface-alt}` (#F2F2F7) as the tonal pearl-grey for cards, chips, icon haloes, and inactive nav. `{colors.on-surface}` is true black for headlines and numerals; `{colors.on-surface-variant}` (#6C6C70) for body and metadata; `{colors.border}` (#E5E5EA) used only for the floating tab bar's hairline.
- **Brand** — `{colors.primary}` (#F37F46) is a warm saturated ember orange. It is the **only** brand color and appears in exactly two roles: (1) hero data cards (full-bleed primary fill with white text), and (2) accent dots — active tab icon tint, streak fire icon, primary CTA fill, focus rings, link text. Never use `{colors.primary}` as a body-card fill; reserve it for the screen's most important block.
- **Categorical icon tints** — within an icon halo (always a pearl-grey or white circle), individual icons may carry a categorical color: `{colors.accent-blue}` (#007AFF), `{colors.success}` (#34C759), `{colors.accent-indigo}` (#5856D6), `{colors.warning}` (#FF9500), `{colors.accent-yellow}` for badges. These never apply to text or surfaces — only to glyph fills inside their circular halos.

**Tonal recipe — soft success/warning chip:** for inline status pips, render `{typography.label-uppercase}` text in the semantic color over a `bg-{color}/10` capsule (e.g. `bg-green-500/10 text-green-600 rounded-full`).

**Boundaries:** ember orange never appears as a card border, divider, or hairline. White text only ever sits on the ember hero card or on photographic imagery. Categorical tints never bleed onto text or primary actions — those stay ember.

## Typography

Single-family system: **Nunito Sans** for everything. The expressive weight range (300–900) does all the work; no second display face is used for chrome.

The signature move is **Black 900** for numerals and the largest displays, paired with **Bold 700** for headings and **Semibold 600** for body. Letter-spacing is tightened progressively as size grows — `-0.04em` at the 120px streak counter, `-0.02em` at hero card numerals, settling to `0` at body. The `{typography.label-uppercase}` token tracks +0.08em and is reserved for kickers (eyebrow above a card title) and metadata captions inside hero cards.

Roles:

- `{typography.display-xl}` — single oversized hero counter (streak day count, big celebratory number). One per screen, max.
- `{typography.display-lg}` — primary hero card stat (the big number on the ember card).
- `{typography.headline-lg}` — primary screen title in the top app bar.
- `{typography.headline-md}` — section anchor or in-card title.
- `{typography.headline-sm}` — card subtitle or secondary action label.
- `{typography.numeral-stat}` — the bold number in a tonal stat tile.
- `{typography.body-md}` — paragraphs, descriptions, helper text.
- `{typography.label-md}` — button text, dense list metadata, link affordances.
- `{typography.label-uppercase}` — tracked-out kickers ("KCAL BURNED", "DURATION") inside stat tiles and over photographic hero panels.
- `{typography.tab-label}` — bottom-bar tab text, uppercase tracked.

**Composition recipe — stat tile:** square tonal card, icon-in-halo top-left, ellipsis or status pill top-right, `{typography.numeral-stat}` near the bottom, then `{typography.label-uppercase}` directly under the number in `{colors.on-surface-variant}`.

## Spacing & Layout

Comfortable but data-dense. Page gutter is `{spacing.gutter}` 24px. Vertical rhythm runs in 8px increments; section breaks are `{spacing.section-gap}` 32px. Cards have generous internal padding (`{spacing.card-padding}` 20px) so the oversized numerals breathe.

Stat tiles arrange in a 2-column grid with 12–16px gutters; the hero card spans both columns at the top. Content scrolls under a floating bottom tab bar that sits 24px above the safe area, requiring a `pb-32` to `pb-44` bottom buffer on scroll containers.

## Elevation & Depth

The system is **mostly flat with two intentional lifts**:

1. **The hero card** uses a soft brand-tinted shadow: `0 10px 25px -5px rgba(243,127,70,0.20)`. The ember card glows slightly off the white canvas.
2. **The floating tab bar** uses a soft neutral shadow: `0 8px 30px rgba(0,0,0,0.12)`, paired with a `backdrop-blur-xl` translucent fill (`bg-white/90`) and a hairline border (`{colors.border}/50`). This is the only chrome element with a border.

Everything else relies on **tonal layering**: white canvas → pearl-grey card → white circular icon halo *inside* the pearl card. No hairlines on cards, no shadows on stat tiles, no gradients.

## Shapes

Roundness is the dominant visual language. The radius scale climbs aggressively:

- `{rounded.md}` (14px) — small inline chips and grid cells.
- `{rounded.lg}` (16px) — bar chart segment tops, small inline tiles.
- `{rounded.xl}` (24px) — segmented control inner buttons.
- `{rounded.2xl}` (28px) — standard tonal stat cards.
- `{rounded.3xl}` (32px) — hero brand cards and large feature panels.
- `{rounded.full}` — every action, every nav, every icon halo, every status pip, every avatar.

Rule: **interactive elements are always `{rounded.full}`**. Containers are 28–32px. Inline data shapes are 14–16px. The shape language never goes sharp — `rounded-none` is forbidden.

## Components

### card
Pearl-grey tonal block. Borderless, shadowless, generously padded.

```html
<div class="bg-[#F2F2F7] rounded-[28px] p-5">
  <div class="flex items-start justify-between">
    <div class="p-2.5 bg-white rounded-full">
      <iconify-icon icon="solar:[icon-name]-bold" class="size-6 text-[#F37F46]"></iconify-icon>
    </div>
    <iconify-icon icon="solar:menu-dots-bold" class="size-5 text-[#6C6C70]/50"></iconify-icon>
  </div>
  <div class="mt-6">
    <div class="text-3xl font-black text-black tracking-tight">[Value]</div>
    <div class="text-sm font-bold text-[#6C6C70]">[Label]</div>
  </div>
</div>
```

### card-hero (signature)
The screen's loudest block. Ember fill, white text, oversized numeral, decorative oversized icon bleeding off the top-right at 20% opacity, plus a translucent inline pill at the bottom.

```html
<div class="bg-[#F37F46] rounded-[32px] p-6 text-white relative overflow-hidden shadow-[0_10px_25px_-5px_rgba(243,127,70,0.20)]">
  <div class="absolute top-0 right-0 p-6 opacity-20">
    <iconify-icon icon="solar:[icon-name]-bold" class="size-24 translate-x-4 -translate-y-4"></iconify-icon>
  </div>
  <div class="relative z-10 flex flex-col gap-4">
    <div class="flex items-center gap-2 text-white/80 font-semibold">
      <iconify-icon icon="solar:[icon-name]-bold" class="size-5"></iconify-icon>
      <span>[Label]</span>
    </div>
    <div>
      <span class="text-[64px] leading-none font-black tracking-tight">[Value]</span>
      <span class="text-xl font-bold ml-1 opacity-80">[unit]</span>
    </div>
    <div class="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full self-start text-sm font-semibold">
      <iconify-icon icon="solar:[icon-name]-bold" class="size-4"></iconify-icon>
      <span>[Trend label]</span>
    </div>
  </div>
</div>
```

### button-primary
Full-rounded ember pill with brand-tinted glow shadow and ultra-bold text.

```html
<button class="w-full bg-[#F37F46] text-white py-5 rounded-full font-black text-lg shadow-[0_12px_30px_-8px_rgba(243,127,70,0.25)] active:scale-95 transition-all flex items-center justify-center gap-3">
  <iconify-icon icon="solar:[icon-name]-bold" class="size-6"></iconify-icon>
  [Action]
</button>
```

### button-secondary
Pearl-grey pill, no shadow.

```html
<button class="w-full bg-[#F2F2F7] text-black py-5 rounded-full font-bold text-lg active:scale-95 transition-all">
  [Action]
</button>
```

### button-icon
Circular pearl-grey halo, icon centered.

```html
<button class="size-10 rounded-full bg-[#F2F2F7] text-black flex items-center justify-center active:scale-90 transition-transform">
  <iconify-icon icon="solar:[icon-name]-linear" class="size-6"></iconify-icon>
</button>
```

### chip / chip-active (segmented control)
Used as a Week/Month/Year segmented control. The container is a pearl-grey pill with inner padding; the active segment lifts to white with a tiny shadow.

```html
<div class="flex items-center justify-between bg-[#F2F2F7]/50 p-1 rounded-2xl">
  <button class="flex-1 py-2 rounded-xl bg-white shadow-sm text-sm font-bold text-black">[Active]</button>
  <button class="flex-1 py-2 rounded-xl text-sm font-semibold text-[#6C6C70]">[Inactive]</button>
</div>
```

### badge-pill (status pip on hero card)
Translucent white pill on top of the ember hero, with leading icon.

```html
<div class="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold text-white">
  <iconify-icon icon="solar:[icon-name]-bold" class="size-4"></iconify-icon>
  <span>[Label]</span>
</div>
```

### badge-circle (compact percent pip)
Tiny tinted capsule for inline metrics:

```html
<div class="text-[10px] font-black px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">[Value]%</div>
```

### avatar

```html
<div class="size-10 rounded-full bg-[#F2F2F7] overflow-hidden">
  <img alt="[name]" src="[url]" class="w-full h-full object-cover" />
</div>
```

### list-row (icon + stat + chevron)

```html
<div class="bg-[#F2F2F7] rounded-[28px] p-5 flex items-center justify-between">
  <div class="flex items-center gap-4">
    <div class="p-2 bg-white rounded-full">
      <iconify-icon icon="solar:[icon-name]-bold" class="size-5 text-[#34C759]"></iconify-icon>
    </div>
    <div>
      <div class="text-xl font-black text-black tracking-tight leading-none">[Value]</div>
      <div class="text-[10px] font-extrabold text-[#6C6C70] uppercase tracking-wide">[Label]</div>
    </div>
  </div>
  <iconify-icon icon="solar:alt-arrow-right-linear" class="size-6 text-[#6C6C70]/30"></iconify-icon>
</div>
```

### top-app-bar
Borderless, shadowless. Optional centered title with `{typography.label-uppercase}` kicker; circular icon button left, avatar right.

```html
<div class="flex items-center justify-between px-6 pt-12 pb-4">
  <button class="size-10 rounded-full bg-[#F2F2F7] flex items-center justify-center active:scale-90">
    <iconify-icon icon="solar:arrow-left-linear" class="size-6"></iconify-icon>
  </button>
  <div class="flex flex-col items-center">
    <h1 class="text-xl font-bold tracking-tight text-black">[Title]</h1>
    <p class="text-[10px] font-bold text-[#6C6C70] uppercase tracking-wider">[Kicker]</p>
  </div>
  <div class="size-10 rounded-full bg-[#F2F2F7] overflow-hidden">
    <img alt="[name]" src="[url]" class="w-full h-full object-cover" />
  </div>
</div>
```

### tab-bar (signature — floating glass capsule)
Translucent white pill, floats above content with backdrop-blur, hairline border, soft shadow. Active tab gets an inset pearl-grey fill behind ember-tinted glyph.

```html
<div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
  <div class="bg-white/90 backdrop-blur-xl border border-[#E5E5EA]/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 flex items-center justify-between">
    <button class="flex-1 flex flex-col items-center justify-center py-3 bg-[#F2F2F7] rounded-full text-[#F37F46] shadow-inner active:scale-95 relative overflow-hidden">
      <div class="absolute inset-0 bg-[#F37F46]/10 rounded-full"></div>
      <iconify-icon icon="solar:[icon-name]-bold" class="size-6 mb-0.5"></iconify-icon>
      <span class="text-[10px] font-bold tracking-wide uppercase">[Active]</span>
    </button>
    <button class="flex-1 flex flex-col items-center justify-center py-3 rounded-full text-[#6C6C70] active:scale-95">
      <iconify-icon icon="solar:[icon-name]-bold" class="size-6 mb-0.5"></iconify-icon>
      <span class="text-[10px] font-bold tracking-wide uppercase">[Inactive]</span>
    </button>
  </div>
</div>
```

**Composition recipe — chart bars / activity grid:** rounded-top bars (`rounded-t-lg`) layered as stacked translucent ember tints (`bg-primary/20`, `bg-primary/40`, `bg-primary` for the active day) inside a pearl-grey background column. Heatmap cells are `aspect-square rounded-lg` filled either `bg-primary` (active, with a small `shadow-primary/20`) or `bg-muted` (rest day). The currently-selected cell adds `ring-2 ring-primary ring-offset-2`.

## Iconography

**Solar icon set, `bold` (filled) variant** is the default for almost every icon — solar's bold glyphs match the chunky black-numeral typography. The `linear` (stroked) variant appears only for navigation chrome that needs to feel quieter — back arrow in the top app bar, chevron-right at the end of a list row.

Icons sit in **circular haloes** by convention: `bg-white rounded-full p-2` to `p-2.5` inside a pearl-grey card, or `bg-[#F2F2F7] rounded-full` as a standalone icon button. The glyph carries categorical color (orange/blue/green/purple/yellow); the halo stays neutral.

Default icon size is 24px (`size-6`); 20px (`size-5`) inside compact list-row haloes; 16px (`size-4`) inside inline pill badges; 96px (`size-24`) for decorative bleed-off icons on the hero card. **Never** mix `bold` and `linear` variants within a single component.

## Illustration & Imagery

**Note**: only one photographic source image is present in the HTML (a sweeping landscape used as a share-card background). The avatar URL is a placeholder portrait, not stylistic content. This section captures the photographic treatment from the share card and infers the supporting rules.

- **Style / Technique**: vivid, high-saturation landscape photography with pronounced golden-hour or blue-hour lighting. Wide-angle composition with strong depth — foreground texture leading the eye toward a luminous horizon. The grade leans punchy and slightly warm, with crisp shadows and saturated naturals (vivid greens, amber skies, cool blue clouds). Documentary in feel, but selected for emotional uplift.
- **Palette**: cinematic naturals — saturated green, golden amber, sky blue, with deep shadow tones. Photographs may share the canvas with the ember brand color, so prefer images whose warm highlights harmonize with `{colors.primary}` (sunsets, sunrises, autumn tones, golden grass) over cool-only scenes.
- **Edge treatment**: full-bleed within a heavily rounded container (`{rounded.3xl}` or larger). No outline, no internal frame.
- **Shading & light**: photographic; preserve natural dynamic range. Apply a top-and-bottom black gradient overlay (`bg-gradient-to-t from-black/60 via-transparent to-black/30`) to ensure white text legibility regardless of source brightness.
- **Composition & framing**: prefer 4:5 aspect (`aspect-[4/5]`), subject horizon centered or in the lower third, generous sky for typography overlays. Avoid centered close-up subjects — the chrome (kicker top-left, stats bottom-left, accent ornament bottom-right) needs perimeter space.
- **Background within the illustration**: the photo IS the background; no further treatment.
- **Container styling**: `rounded-[2.5rem]` (40px), no border, soft brand-tinted shadow `shadow-2xl shadow-primary/10`. Background fallback `bg-muted` while the image loads.
- **CSS treatment on the `<img>`**: `absolute inset-0 w-full h-full object-cover`. No mix-blend-mode, no opacity reduction, no filter. The full-color photograph is the point.
- **Box-shadow on the frame**: `0 25px 50px -12px rgba(243,127,70,0.10)` (the `shadow-2xl shadow-primary/10` Tailwind combo). The frame floats just barely off the canvas with a brand-tinted lift.
- **Aspect ratio rule**: 4:5 is canonical for share / hero photo cards. Avatars are 1:1 circular at 40px. Inline thumbnails (if needed) follow the source ratio in a `{rounded.2xl}` frame.
- **Anti-references**: NOT illustrated, NOT 3D rendered, NOT flat vector, NOT desaturated/muted, NOT moody/dark, NOT studio-lit product photography, NOT abstract patterns, NOT line-art.
- **Style recipe prompt**: *"A vivid, golden-hour or blue-hour landscape photograph of [SUBJECT]. Wide-angle, deep foreground-to-horizon depth, saturated naturals with warm amber highlights and crisp shadows. Cinematic uplifting mood, clean horizon line in the lower third, generous sky above. Slight contrast boost, not over-graded. NOT illustrated, NOT 3D, NOT flat vector, NOT muted, NOT moody."*

When a brief calls for an avatar without a real portrait, fall back to a colored initial circle: `size-10 rounded-full bg-{colors.surface-alt}` with the initial in `{typography.label-md}` 700 weight, `{colors.on-surface}`.

## Hierarchy & Emphasis

- **The biggest, blackest numeral wins.** Data is the loudest thing on every screen.
- **Saturation is rationed.** Exactly one ember-fill block per screen (the hero card, primary CTA, or active state — never multiple at once except CTA + active tab, which are visually separated).
- **Pearl-grey recedes.** Stat tiles, segmented controls, secondary buttons, and inactive nav all share the same pearl, deliberately uniform so the ember accent reads instantly.
- **Categorical icon color whispers.** Categorical tints (blue/green/purple/yellow) appear *only* inside tiny circular haloes — they identify a metric, never demand attention.
- **Metadata uppercases and tracks out.** Captions like "KCAL BURNED" sit at 10px, weight 800, +0.08em.

## Distinctive Details

1. **The ember hero card with bleeding decorative icon.** A 96px solar:bold glyph at 20% opacity, translated `+16px / -16px`, anchors the top-right corner and bleeds off-canvas. This is the signature visual move.
2. **Icons live in white circular haloes inside pearl cards.** Never bare on the surface — always `bg-white rounded-full p-2.5`. The double-radius (round halo inside round card) is the aesthetic's calling card.
3. **The floating glass tab capsule.** Translucent `white/90`, `backdrop-blur-xl`, hairline border at `border/50`, soft drop shadow. The active tab is an inset pearl pill with ember glyph — no underline, no dot.

## Do's and Don'ts

### Do
- Use `{colors.primary}` exactly once per screen as a hero fill; let it dominate.
- Wrap every icon-on-card in a white circular halo.
- Keep all interactive elements `{rounded.full}` — buttons, avatars, chips, tab items.
- Use Black 900 weight for numerals and ultra-large displays; tighten letter-spacing as size grows.
- Render kickers and metadata as 10px uppercase tracked-out labels.
- Float the tab bar above content with backdrop-blur translucency.
- Layer tonal transparencies (`primary/20`, `primary/40`, `primary`) for chart fills and progress indicators.

### Don't
- Don't apply `{colors.primary}` as a background to ordinary cards — it's reserved for the hero block.
- Don't add hairline borders to cards or stat tiles; rely on tonal contrast.
- Don't use `linear` solar variants for content icons — keep `bold` consistent; `linear` is only for nav chrome (back arrow, chevron).
- Don't introduce a second display typeface — Nunito Sans 300–900 covers everything.
- Don't render shadows on tonal pearl cards; only the ember hero card and the floating tab bar carry shadows.
- Don't use bright photography subjects with clashing color casts (cool-only blues, magenta neons) — prefer warm-harmonizing landscapes.
- Don't square off corners; `rounded-none` is forbidden in this aesthetic.
- Don't stack multiple ember-saturated elements adjacent to each other — let the ember breathe against pearl and white.
