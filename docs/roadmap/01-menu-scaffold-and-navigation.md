# Menu Scaffold and Navigation

- App shell with sidebar on desktop, bottom navigation bar on mobile
- Route structure: `/movie/:id`, `/show/:id`, `/stats`, `/recommendations` (base routes `/`, `/library`, `/calendar`, `/settings` already scaffolded)
- Active route is visually highlighted in both sidebar and bottom nav
- Navigation remains visible on all screens (no full-page takeovers)

## Acceptance Criteria

- [ ] `AppShell` component renders a sidebar on viewports ≥ 768 px and a bottom nav bar below 768 px
- [ ] All 5 navigation-bar routes are navigable and render a placeholder view
- [ ] Active route indicator updates on navigation (both sidebar and bottom nav)
- [ ] `ErrorBoundary` wraps the router outlet and displays a fallback UI on unhandled errors

## Key Decisions

- **Tailwind responsive utilities** — breakpoint-based show/hide for sidebar vs. bottom nav, no JavaScript resize listeners
