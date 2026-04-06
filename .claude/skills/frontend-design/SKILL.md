---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics while strictly adhering to the project's UI-UX specification.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices, while remaining strictly compliant with the project's architectural and design mandates.

**CRITICAL**: The specifications in `@docs/technical/ui-ux.md` take absolute precedence. All designs must adhere to the "Dark Cinematic" aesthetic and use Tailwind utility classes exclusively.

## Design Thinking

Before coding, ensure the implementation aligns with the "Movie Theater" vision:

- **Purpose**: Facilitate immersive media browsing and library management.
- **Tone**: Cinematic, dark, and refined. Avoid "spreadsheet" density.
- **Constraints**:
  - **Styling**: Tailwind utility classes ONLY. No separate CSS files or inline styles (except for flash prevention).
  - **Typography**: System font stack or Inter ONLY. No decorative fonts.
  - **Motion**: Subtle and cinematic. 200-300ms durations. No bounce, spring, or parallax.
- **Differentiation**: Leverage the "Image-forward" approach. The UI is a frame for the media.

## Frontend Aesthetics Guidelines (Project-Specific)

Focus on:

- **Typography Execution**: Since fonts are limited to the system stack/Inter, design quality comes from precision in **letter-spacing (tracking)**, **line-height (leading)**, and **font-weight**. Use `tracking-tight` for hero titles and `tracking-wide` for small metadata to create a premium feel.
- **Color & Theme**: Stick to the deep navy/slate background (`#0f1923`) and teal-500 accents. Use gradients primarily for legibility overlays on backdrop images, not as decorative elements.
- **Motion**: Prioritize **staggered reveals** for grids and lists to create an "orchestrated" feel, but keep them within the 300ms limit. Use `transition-opacity` and `transition-transform` for subtle card hovers (`scale-105`) as specified.
- **Spatial Composition**: Maintain the fixed sidebar/scrollable content shell. Use generous negative space between sections (`space-y-8`) to prevent a cluttered "utility" look. Ensure grids follow the responsive column counts defined in the UI-UX doc.
- **Visual Details**: Create depth using surface colors (`slate-800`) and subtle shadows rather than borders. Use the `shimmer` effect for all loading states (skeleton loaders) to maintain the cinematic flow.

NEVER use:

- Generic "Dashboard" patterns that feel like business software.
- Bright or varied color palettes (stay within the navy/teal theme).
- Bouncy, elastic, or overly aggressive animations.
- Custom/decorative fonts that deviate from the system stack.
- Inline styles or `.css` files.

**IMPORTANT**: Elegance in this project comes from **restraint and precision**. Match implementation complexity to the "Cinematic" vision—high-quality imagery, clean typography, and seamless, subtle transitions.
