---
name: Luxury Retro-Tech
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ddc1ae'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a48c7a'
  outline-variant: '#564334'
  surface-tint: '#ffb77d'
  primary: '#ffb77d'
  on-primary: '#4d2600'
  primary-container: '#ff8c00'
  on-primary-container: '#623200'
  inverse-primary: '#904d00'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#ffb68c'
  on-tertiary: '#532200'
  tertiary-container: '#ee945c'
  on-tertiary-container: '#692e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#753401'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Chivo
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  display-vinyl:
    fontFamily: Chivo
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  card-gap: 24px
---

## Brand & Style

The design system is a sophisticated fusion of "Analog Luxury" and "Future-Nostalgia." It targets a mature demographic (ages 45-75) who appreciate the tactile precision of high-end hi-fi systems, the weighted movement of a Porsche dashboard, and the revolutionary simplicity of the iPod Classic.

The visual language balances the weight of metallic textures with the ethereal quality of amber-tinted glassmorphism. It is designed to evoke an emotional response of "comfortable prestige"—where technology feels like an heirloom rather than a disposable commodity. The style utilizes **tactile skeuomorphism** and **glassmorphism** to create a UI that users feel they can reach out and touch.

**Key Design Principles:**
- **Mechanical Precision:** Every element should feel engineered, with subtle inner shadows and highlights suggesting physical depth.
- **Cinematic Warmth:** The use of amber and gold accents provides a "vacuum tube" glow against the cold, professional gunmetal surfaces.
- **Low Cognitive Friction:** Despite the rich visual style, the layout remains strictly hierarchical and intuitive, prioritizing legibility and large touch targets for the target audience.

## Colors

The palette is strictly dark-mode, rooted in the aesthetic of high-end audio lounges.

- **Foundations:** The background uses a deep charcoal (#121212) to create infinite depth. Surfaces utilize gunmetal gray (#1A1A1A) with subtle brushed-metal textures.
- **Accents:** The "Warm Orange Glow" (#FF8C00) is the primary interactive color, mimicking the filament of a vacuum tube. "Soft Gold" (#D4AF37) is used sparingly for premium indicators and secondary highlights.
- **Functional Amber:** A brighter amber (#FFBF00) is reserved for active states, playback progress, and thin iconic glows to ensure high visibility against the dark backdrop.
- **Vinyl Textures:** Large surfaces should include a microscopic "radial noise" overlay (opacity 3-5%) to simulate the texture of high-quality vinyl or brushed aluminum.

## Typography

The typography system prioritizes high-contrast legibility for an older audience while maintaining a tech-forward edge.

- **Headlines:** Uses **Chivo** for its confident, geometric structure that mirrors industrial engravings. For large "Decade" headers (e.g., 80s, 90s), use the **display-vinyl** role with a subtle metallic gradient overlay.
- **Body:** **Inter** is the workhorse here, chosen for its exceptional x-height and clarity at 18px+, ensuring lyrics and metadata are easily readable.
- **Labels:** **Space Grotesk** is used for navigation and small metadata, providing a "technical readout" feel that complements the retro-tech theme.
- **Accessibility:** Never go below a 14px font size. Ensure a minimum contrast ratio of 7:1 for all body text against charcoal backgrounds.

## Layout & Spacing

The layout is built on a **Fluid Grid** with generous breathing room to reduce "UI noise" and cognitive load. 

- **Grid Model:** Use a 4-column grid for mobile and a 12-column grid for desktop.
- **Rhythm:** An 8px base unit governs all dimensions. Elements are separated by "safe zones" of 24px to prevent accidental taps, a critical consideration for the target age group.
- **Containment:** Content is housed in tactile containers that clearly define functional areas (e.g., the playback deck vs. the library list). 
- **Reflow:** On tablet and desktop, the "Now Playing" interface should remain fixed as a secondary "control deck" on the right, mimicking a physical rack-mounted audio system, while the library scrolls independently.

## Elevation & Depth

Hierarchy is established through **Physical Layering** and **Cinematic Lighting**:

- **Surface Tiers:**
  - **Level 0 (Background):** Solid #121212.
  - **Level 1 (Main UI):** Brushed Gunmetal (#1A1A1A) with 1px gold-tinted top border (0.1 opacity) to catch "light."
  - **Level 2 (Active Cards):** Glassmorphism surfaces (Background Blur: 20px) with 10% white opacity.
- **Shadows:** Use "Deep Cinematic" shadows. Instead of neutral black, use a slightly warmer shadow color (#080500 at 60% opacity) with high diffusion (30px-50px) to simulate a soft ambient glow under heavy metallic plates.
- **The "Glow" Effect:** Active elements (like the currently playing track) should emit a soft amber outer glow (`drop-shadow: 0 0 10px rgba(255, 140, 0, 0.3)`).

## Shapes

The shape language reflects the "Rounded-Industrial" aesthetic of early 2000s premium tech.

- **Primary Radius:** A 0.5rem (8px) radius is the standard for most containers, providing a "machined" look that isn't too sharp.
- **Large Components:** Cards and main containers use a 1rem (16px) radius to feel more substantial and "weighted."
- **Interactive Elements:** Buttons use a highly rounded 2rem (pill) or perfect circles (for playback controls) to mimic physical knobs and switches.
- **The Wheel:** Any navigational elements inspired by the click-wheel should be perfect circles with concentric "brushed metal" CSS gradients.

## Components

- **Tactile Cards:** Use a combination of a subtle inner shadow (top-left light source) and a drop shadow to make cards look like physical modules plugged into the dashboard.
- **Metallic Buttons:** Buttons should have a "pressed" state using `box-shadow: inset 2px 2px 4px rgba(0,0,0,0.5)`. The "Up" state should have a subtle linear gradient from top-left (#333) to bottom-right (#1A1A1A).
- **Navigation Bar:** A fixed bottom bar with a heavy glassmorphism blur (30px). Icons must be paired with labels in **Space Grotesk** for maximum clarity. Icons should use a 1.5px stroke width.
- **Playback Controls:** The "Play/Pause" button is the focal point. It should feature a "Soft Gold" metallic ring and a soft amber glow when active.
- **Input Fields:** Styled as "inset displays," using a darker background than the surface and a subtle inner glow, mimicking an LCD screen set into a dashboard.
- **Progress Bars:** Use a "Glow Rail" style—a dark, recessed track with a bright amber "filament" that fills as music plays.