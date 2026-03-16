# Design System Strategy: Architectural Precision



## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Structural Gallery."**



This is not a standard B2B platform; it is a digital environment that mirrors the experience of a high-end showroom in Milan or a gallery in SoHo. By stripping away the "veneer" of traditional web design—rounded corners, soft shadows, and decorative elements—we allow the footwear to exist as sculptural objects.



The aesthetic is driven by **Architectural Minimalism.** We achieve a premium feel through high-contrast monochrome values, radical whitespace, and a rigid adherence to a 0px border radius. To move beyond a generic template, this system utilizes intentional asymmetry and a "tension" between the serif elegance of the display type and the brutalist utility of the monospaced-adjacent body type.



---



## 2. Colors & Surface Logic

The palette is rooted in absolute blacks and varying degrees of architectural grays, punctuated by a single metallic accent.



### The Palette

- **Primary (`#000000`):** Used for critical branding and high-impact calls to action.

- **Secondary/Accent (`#765933`):** To be used sparingly as a "hallmark" color—representing quality and luxury hardware.

- **Surface Tiers:** Use `surface_container_lowest` (#ffffff) for primary content areas and `surface_container` (#eeeeee) to define distinct functional zones.



### The "No-Line" Rule

While the initial instinct in minimalism is to use lines, this system demands a more sophisticated approach. **Prohibit 1px solid borders for sectioning.**

- Boundaries must be defined through background color shifts. For example, a product description in `surface_container_low` sitting against a `surface` background creates a clean, architectural edge without the visual noise of a stroke.

- **Exception:** Vertical 1px lines may be used only to separate high-level navigation items or to create a "grid" feel in product listings, but never to "box in" content.



### Signature Textures

To avoid a "flat" digital feel, main CTAs or hero backgrounds should utilize a subtle gradient transition from `primary` to `primary_container`. This adds a "weighted" feel to the black, making it look more like physical ink or dyed leather than a hex code.



---



## 3. Typography

The typographic hierarchy creates a dialogue between tradition and modernity.



- **Display & Headlines (Newsreader/Playfair Style):** These are our "Editorial" voices. Use `display-lg` and `headline-lg` for product names and hero statements. The high-contrast serifs reflect the craftsmanship of footwear.

- **Body & Labels (Space Grotesk):** This is our "Utility" voice. The geometric, slightly technical nature of Space Grotesk provides a B2B authority. It feels like a manifest or an architectural blueprint.

- **The Contrast Rule:** Always pair a `headline-sm` in Newsreader with a `label-sm` in Space Grotesk (all caps) to create a high-fashion editorial tension.



---



## 4. Elevation & Depth

In this system, we do not use shadows. Depth is achieved through **Tonal Layering.**



- **The Layering Principle:** Treat the UI as stacked sheets of premium cardstock. Place a `surface_container_lowest` card on a `surface_container_low` section to create a soft, natural lift.

- **Glassmorphism & Depth:** For floating navigation or product filters, use semi-transparent surface colors (80-90% opacity) with a `backdrop-blur` effect. This allows the structural lines of the footwear images to bleed through, softening the layout’s rigidity.

- **The "Ghost Border" Fallback:** If a container requires definition against a similar background (e.g., an input field), use the `outline_variant` token at **20% opacity**. Never use 100% opaque borders for decorative containment.



---



## 5. Components



### Buttons

- **Primary:** Solid `primary` background, `on_primary` text, 0px radius. High padding (e.g., `spacing-4` on sides) to create a "wide" architectural stance.

- **Tertiary (Ghost):** No background or border. Use `label-md` in Space Grotesk with a custom 1px underline that sits 4px below the baseline.



### Input Fields

- **Styling:** 0px radius, `surface_container_highest` background. No border.

- **State:** On focus, the background shifts to `surface_container_lowest` and a 1px `primary` bottom border appears (architectural underline).



### Cards & Lists

- **Forbid Divider Lines:** Use `spacing-12` or `spacing-16` to separate list items. Whitespace is your primary organizational tool.

- **Imagery:** Product cards should have zero padding between the image and the container edge. The image *is* the structure.



### Additional Components: The "Lookbook" Carousel

A non-standard component for this system. It uses asymmetrical sizing—the center image is `headline-lg` height, while the flanking images are 30% smaller and desaturated using the `muted` token, creating a "gallery" focal point.



---



## 6. Do's and Don'ts



### Do

- **Embrace Asymmetry:** Align text to the far left and the CTA to the far right with vast whitespace between them to create "tension."

- **Use Large Type:** Don't be afraid to let a `display-lg` heading take up 50% of the viewport.

- **Respect the 0px:** Every element, from images to hover states, must maintain sharp, 90-degree angles.



### Don't

- **No Softness:** Never use shadows, blurs (except for glassmorphism), or rounded corners. It breaks the architectural integrity.

- **No Standard Grids:** Avoid the 12-column "Bootstrap" look. Use wide margins (e.g., `spacing-24`) and off-center placements.

- **No Gray-on-Gray:** Ensure text is either `on_surface` or `muted`. Intermediate grays create a "muddy" look that ruins the stark monochrome contrast.



---



## 7. Spacing Scale

The spacing is intentionally generous to evoke a sense of luxury.

- **Section Padding:** Use `spacing-20` (7rem) or `spacing-24` (8.5rem).

- **Element Gaps:** Use `spacing-6` (2rem) as the minimum "breathing room" between unrelated elements.

- **Micro-interactions:** Use `spacing-px` (1px) only for intentional structural accents.