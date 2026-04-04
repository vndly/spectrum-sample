# Verification Scenarios: App Scaffolding

## Contents

1. **[SC-01a-01](./SC-01a-01.feature)**: Dependency installation (vue-router and @vue/test-utils).
2. **[SC-01a-02](./SC-01a-02.feature)**: Vitest configuration properties, test runner, CI check, and testing.md update.
3. **[SC-01a-03](./SC-01a-03.feature)**: Test setup file, localStorage cleanup, and TypeScript globals.
4. **[SC-01b-12](./SC-01b-12.feature)**: i18n keys for navigation, page titles, empty state, error, and toast labels.
5. **[SC-01c-09](./SC-01c-09.feature)**: Fade transition CSS class definitions.
6. **[SC-01c-21](./SC-01c-21.feature)**: Tailwind theme color token existence and values.
7. **[SC-01c-22](./SC-01c-22.feature)**: Toast transition CSS classes and animation behavior.
8. **[SC-01c-23](./SC-01c-23.feature)**: Modal transition CSS classes and content card animation.
9. **[SC-01c-24](./SC-01c-24.feature)**: Reduced-motion override, pulse animation suppression, and duration cap verification.
10. **[SC-01c-25](./SC-01c-25.feature)**: Domain constants for toast auto-dismiss.
11. **[SC-01d-02](./SC-01d-02.feature)**: Route definitions, named routes, navigation, and catch-all redirect.
12. **[SC-01d-03](./SC-01d-03.feature)**: Route lazy loading and code splitting via dynamic import().
13. **[SC-01d-10](./SC-01d-10.feature)**: Document title updates on navigation via i18n.
14. **[SC-01d-11](./SC-01d-11.feature)**: Scroll-to-top behavior on route change.
15. **[SC-01d-22](./SC-01d-22.feature)**: Router unit test specification for route behavior.
16. **[SC-01d-29](./SC-01d-29.feature)**: Vue Router setup with HTML5 history mode and app registration.
17. **[SC-12](./SC-12.feature)**: Modal composable behavior — open, close, single-instance replacement, and edge cases.
18. **[SC-13](./SC-13.feature)**: Toast composable behavior — toast queue management, auto-dismiss, action buttons, and eviction.
19. **[SC-14](./SC-14.feature)**: Toast container component — rendering, stacking, transitions, and interactions.
20. **[SC-15](./SC-15.feature)**: Modal dialog component — rendering, backdrop, callbacks, and transitions.
21. **[SC-16](./SC-16.feature)**: Empty state component rendering and props.
22. **[SC-17](./SC-17.feature)**: Skeleton loader animation and dimensions.
23. **[SC-18](./SC-18.feature)**: Error boundary fallback UI, reload, and propagation prevention.
24. **[SC-19](./SC-19.feature)**: Global error handler toast dispatch and boundary interaction.
25. **[SC-23](./SC-23.feature)**: Composable unit tests — toast and modal state management verification.
26. **[SC-24](./SC-24.feature)**: UI primitive component tests for EmptyState, SkeletonLoader, ErrorBoundary, ToastContainer, and ModalDialog.
27. **[SC-04](./SC-04.feature)**: App-shell layout across desktop sidebar, mobile bottom nav, and content clearance.
28. **[SC-05](./SC-05.feature)**: Desktop sidebar structure, icons, and translated labels.
29. **[SC-06](./SC-06.feature)**: Mobile bottom-nav rendering and touch targets.
30. **[SC-07](./SC-07.feature)**: Active-route highlighting rules for desktop and mobile nav.
31. **[SC-08](./SC-08.feature)**: Page-header titles, sticky positioning, and locale behavior.
32. **[SC-09](./SC-09.feature)**: Route-transition fade behavior and reduced-motion fallback.
33. **[SC-10](./SC-10.feature)**: Root shell assembly, current nav composition, and overlay stacking.
34. **[SC-25](./SC-25.feature)**: Component-test coverage for sidebar, bottom nav, and page header.
35. **[SC-20](./SC-20.feature)**: Placeholder view rendering for all scaffolded routes.
36. **[SC-26](./SC-26.feature)**: Placeholder view component-test coverage.
37. **[R-01b-01](./R-01b-01.feature)**: Recommendations route definitions, lazy loading, and direct URL rendering.
38. **[R-01b-02](./R-01b-02.feature)**: Recommendations nav order, translations, active state, and touch targets.
39. **[R-01b-03](./R-01b-03.feature)**: Stats placeholder routing and locale-key coverage.
40. **[R-01b-04](./R-01b-04.feature)**: Movie and show placeholder detail routes for numeric IDs.
41. **[R-01b-05](./R-01b-05.feature)**: Non-numeric detail-route guard redirects.
42. **[R-01b-06](./R-01b-06.feature)**: Shared EmptyState rendering and translation-key bindings for new views.
43. **[R-01b-07](./R-01b-07.feature)**: App-shell behavior, fade transitions, and zero side effects on new routes.
44. **[R-01b-08](./R-01b-08.feature)**: Router, layout, view, locale, and project-level verification coverage.

> **i18n note:** Theme, transitions, and constants deliver CSS definitions and a numeric constant with no user-facing text. i18n coverage is not applicable for those scenarios.
