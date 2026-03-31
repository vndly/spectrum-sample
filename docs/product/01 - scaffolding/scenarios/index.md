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

> **i18n note:** Theme, transitions, and constants deliver CSS definitions and a numeric constant with no user-facing text. i18n coverage is not applicable for those scenarios.
