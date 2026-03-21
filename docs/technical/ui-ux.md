# UI & UX

Design specification for the movie tracker interface. All styling uses Tailwind utility classes and the theme config — no inline styles or separate CSS files.

## 1. Visual Identity

- **Aesthetic** — Dark cinematic feel. Immersive backgrounds, hero imagery, and rich media. The app should feel like a movie theater, not a spreadsheet.
- **Background** — Deep navy/slate (`#0f1923` to `#1a2332`), not pure black. Tailwind custom theme color.
- **Accent color** — Cyan/teal (`~teal-500` / `#14b8a6`) for active states, buttons, rating badges, and highlights. Single brand accent throughout.
- **Surface colors** — Cards and elevated surfaces use a slightly lighter shade than the background (`~slate-800` / `#1e293b`). Subtle shadow for depth — no harsh borders.
- **Text colors** — Primary: white (`#ffffff`). Secondary (years, metadata): muted gray (`~slate-400`). Never use pure black text.
- **Image-forward** — Posters, backdrops, and hero banners are the visual centerpiece. The UI is a frame for the media, not the other way around.

## 2. Typography

- **Font family** — System font stack or clean sans-serif (Inter, `system-ui`). No decorative fonts.
- **Hero titles** — `text-2xl` to `text-4xl`, `font-bold`, white. Overlaid on backdrop images with gradient for legibility.
- **Section headings** — `text-lg` / `text-xl`, `font-bold`, white (e.g., "Trending Now", "Popular Movies & Shows").
- **Card titles** — `text-sm font-medium text-white`. Single line, truncated with ellipsis if too long.
- **Card metadata** — `text-xs text-slate-400` (year, episode count).
- **Body text** — `text-sm` or `text-base`, white or light gray. Used for synopses and descriptions.
- **No uppercase transforms** — Keep natural casing throughout.

## 3. Layout

- **App shell** — Fixed sidebar on the left, scrollable content area on the right. Sidebar does not scroll with content.
- **Sidebar** — `w-56` to `w-64` (224–256px) on desktop. Contains logo and nav items only.
- **Content area** — Fills remaining width. Padded `p-4` to `p-6`. Fluid width, no max-width constraint.
- **Card grids** — CSS grid via Tailwind with responsive column counts. Base styles target desktop; use `max-*` breakpoints to reduce columns for smaller screens:

| Breakpoint            | Columns | Context                       |
| --------------------- | ------- | ----------------------------- |
| Base (desktop)        | 5–6     | Wide desktop                  |
| `max-xl` (< 1280px)   | 4–5     | Standard desktop              |
| `max-lg` (< 1024px)   | 3–4     | Sidebar appears, multi-column |
| `max-md` (< 768px)    | 2–3     | Bottom nav, narrower layout   |
| `max-sm` (< 640px)    | 2       | Single-column mobile layout   |

- **Spacing** — `space-y-6` or `space-y-8` between major sections. `gap-4` between grid cards.
- **Responsive behavior** — Desktop-first. Base styles target desktop; Tailwind breakpoints override for smaller screens. Below `md`: sidebar hidden, bottom nav bar visible, single-column layout. `md` and above: sidebar visible, multi-column grids.

## 4. Navigation

### Desktop Sidebar

- Fixed left panel with dark background (same tone as or slightly lighter than content area).
- App logo + name at the top.
- Nav items listed vertically, each with icon + text label.
- Active item highlighted with teal accent (left border or background tint).
- Inactive items in muted gray/white.

### Mobile Bottom Nav

- Fixed bottom bar, visible below `md` breakpoint only.
- Same nav items as sidebar. Icon-only or icon + short label.
- Active item uses the same teal accent.

### Nav Items

| Route              | Label           | Icon          |
| ------------------ | --------------- | ------------- |
| `/`                | Home            | House icon    |
| `/recommendations` | Recommendations | Compass icon  |
| `/calendar`        | Calendar        | Calendar icon |
| `/library`         | Library         | Bookmark icon |
| `/settings`        | Settings        | Gear/cog icon |

`/movie/:id`, `/tv/:id`, and `/stats` are not in the nav — accessed via card clicks and internal links.

### Search Bar

- Full-width input at the top of the Home screen content area.
- Search icon on the left, rounded corners, dark background (`~bg-slate-800`).
- Placeholder: "Search for movies or TV shows..."
- Focus state: subtle border glow in accent color.

## 5. Component Patterns

### Movie Card

The most-used component across Home, Recommendations, Library, and search results.

- **Poster image** — Fills the card. `rounded-lg`, 2:3 aspect ratio (standard movie poster).
- **Rating badge** — Top-right corner. Small teal pill with star icon + score (e.g., "8.4"). `text-xs font-bold`, white text, positioned `absolute top-2 right-2`.
- **Title** — Below the poster. `text-sm font-medium text-white`, single line, truncated with ellipsis.
- **Year** — Below the title. `text-xs text-slate-400`.

### Hero Banner (Trending Carousel)

- Full-width banner spanning the content area.
- TMDB backdrop image as background (`w780` or `original` size).
- Dark gradient overlay from bottom-left for text legibility.
- Title: large bold white text (`text-2xl` to `text-3xl`), bottom-left.
- "Watchlist +" button: teal accent, small pill.
- "In Theaters Now >" text link on the right.
- Dot pagination indicators: small circles at bottom center. Active dot filled/white, inactive dots muted.

### Tab Toggle

Horizontal row of text tabs (e.g., Library: Watchlist / Watched / Lists).

- Active tab: white text with underline or bold weight.
- Inactive tabs: muted gray text.
- Clean inline text — no background pills or boxes.

### Sort & Filter Controls

- **Sort dropdown** — Small button with label ("Sort: Popularity" or "Added Date") and chevron icon. Dark background, light text.
- **View toggle** — Grid/list toggle icons in top-right. Active icon highlighted in white or accent, inactive in muted gray.

### Buttons

- **Primary** — Teal background, white text, `rounded-md` or `rounded-lg`, `px-4 py-2`. Used for "Watchlist +", "Watch Trailer", empty-state CTAs.
- **Secondary / Ghost** — Transparent background, white or muted text, subtle border or none. Used for "In Theaters Now >", secondary actions.
- **Icon button** — Square, transparent background, icon-only. Used for bookmark, favorite, share.
- All buttons: `cursor-pointer`, `transition-colors`, hover state slightly lighter/darker.

### Detail Screen

- **Hero backdrop** — Full-width backdrop image at top with gradient overlay fading to dark background at bottom. Title overlaid in large bold text. Bookmark icon next to title.
- **Metadata line** — Year | Seasons | Episodes as pipe-separated text in muted color.
- **Synopsis** — Paragraph of body text below metadata.
- **Info pairs** — Genre, Cast, Writer, Director displayed as bold label + normal value.
- **Poster** — Positioned to the right of metadata on desktop. Standard poster image.
- **IMDb badge** — "IMDb" label + score (e.g., "8.1/10") + "REVIEWS" link.
- **Watch Trailer** — Primary button with play icon.
- **Gallery** — Horizontal row of thumbnail images at the bottom.

## 6. Interaction Patterns

- **Card hover** — Subtle scale-up (`scale-105`) with `transition-transform duration-200`. Entire card is clickable, navigates to `/movie/:id` or `/tv/:id`.
- **Nav item hover** — Text brightens to white. Active item stays teal-accented.
- **Button hover** — Slightly lighter background shade. No movement or scale.
- **Button active/pressed** — Slightly darker background shade.
- **Star rating** — Interactive 5-star widget on detail screen. Stars fill on hover, click confirms rating.
- **Carousel** — Dot indicators for manual selection. Swipe on touch devices.
- **Dropdown** — Appears below trigger on click. Dark background, no animation or simple fade-in.
- **Focus states** — Browser-default focus rings on interactive elements. No custom focus styling.

## 7. Transitions & Animations

- **Duration** — All transitions 200–300ms. Never exceed 300ms. Easing: `ease-in-out`.
- **Route transitions** — Soft opacity fade between views (200ms). No slide or complex page transitions.
- **Card hover** — `transition-transform duration-200 ease-in-out`.
- **Carousel** — Smooth slide or crossfade between hero banner items.
- **Toast notifications** — Slide in from top-right, auto-dismiss after 3–5 seconds with fade-out.
- **Modal/overlay** — Fade-in backdrop + slight scale-up for content (if modals are used).
- **Tab switching** — Instant content swap, no transition.
- **No bounce, spring, or parallax effects** — Keep it subtle and cinematic.

## 8. Loading States

- **Skeleton loaders everywhere** — Shimmer placeholders that match the exact layout shape of the content being loaded. No circular spinners.
- **Card skeleton** — Rounded rectangle matching poster aspect ratio (2:3), with smaller text rectangles below for title and year. Animated shimmer gradient (`animate-pulse` or custom shimmer keyframe).
- **Hero skeleton** — Full-width rounded rectangle matching the banner height. Shimmer effect.
- **Detail skeleton** — Full-width backdrop placeholder + text line placeholders for title, metadata, and synopsis.
- **Grid skeleton** — Show the expected number of card skeletons for the current breakpoint (e.g., 6 on desktop, 2 on mobile).
- **Search loading** — Skeleton cards appear in the results area while the API call is in progress. Search input remains interactive.

## 9. Empty States

- **Centered layout** — Message vertically and horizontally centered in the content area.
- **Illustration** — Optional subtle icon or graphic above the message (minimal, on-theme).
- **Heading** — Bold white text, clear and direct.
- **Supporting text** — One line of muted gray text below the heading explaining what to do.
- **CTA button** — Primary teal button guiding the user to action.

Per-screen messages:

| Screen         | Heading                    | Supporting text                                 | CTA                            |
| -------------- | -------------------------- | ----------------------------------------------- | ------------------------------ |
| Library (all)  | "Your library is empty"    | "Search for a movie or TV show to get started." | "Discover something to watch"  |
| Watchlist      | "Your watchlist is empty"  | "Find something you want to watch."             | "Browse trending titles"       |
| Watched        | "Nothing watched yet"      | "Mark titles as watched to see them here."      | "Check your watchlist"         |
| Search results | "No results found"         | "Try a different search term."                  | *(text only, no button)*       |
| Stats          | "No stats yet"             | "Watch some movies to see your statistics."     | "Go to your library"           |

## 10. Error States & Notifications

### Toast Notifications

- Small, non-blocking alerts positioned in the top-right corner.
- Dark surface background, slightly lighter than the page background.
- Text: white for message, muted for secondary info.
- Auto-dismiss after ~4 seconds. Optional manual dismiss (X button).
- Include "Retry" action on API failure toasts.

| Type    | Accent | Example                                               |
| ------- | ------ | ----------------------------------------------------- |
| Error   | Red    | "Failed to load movie details." + Retry               |
| Success | Green  | "Added to watchlist."                                 |
| Info    | Teal   | "Storage issue detected. Some data may not be saved." |

### Error Boundary Fallback

Full-screen centered layout: "Something went wrong" heading, supporting text, and "Reload" primary button. Catches unhandled errors globally.

## 11. Accessibility

- **Minimal scope** — No WCAG compliance target. Basic usability only.
- **Keyboard** — Browser-default tab navigation for links, buttons, and inputs. No custom keyboard shortcuts or focus trapping.
- **Color contrast** — Not formally tested. The high-contrast white-on-dark theme provides reasonable readability by default.
- **Screen readers** — No ARIA attributes beyond semantic HTML defaults. Use native `<button>`, `<a>`, `<input>` elements.
- **Motion** — Respect `prefers-reduced-motion` media query by disabling transitions and animations when set.
- **Touch targets** — Minimum 44×44px on mobile for all interactive elements.

## 12. Theme Support

- **Default** — Dark theme (the cinematic aesthetic described above).
- **Light theme** — Planned but secondary. Will invert the color palette when implemented.
- **Implementation** — Tailwind class-based dark mode strategy. Theme preference stored in `Settings.theme` via `StorageService`. Toggle available in Settings screen.
