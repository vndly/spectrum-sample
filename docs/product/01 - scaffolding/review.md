# Review: App Scaffolding

**Reviewed:** 2026-03-22
**Folder:** `docs/product/01 - scaffolding/`
**Files reviewed:** requirements.md, plan.md, scenarios.md, index.md

## Summary

The documentation is thorough and well-structured — requirements are detailed, the plan is phased logically, and scenarios cover most functional requirements. However, one critical architectural contradiction (test file location) must be resolved before implementation, along with several warnings around missing transition CSS, translation accuracy, and traceability gaps.

0 critical | 16 warnings | 12 suggestions — across 4 files.

**Verdict**: Acceptable — no critical findings remain. Warnings and suggestions should be addressed during implementation.

## Findings

### Warnings

- **[requirements.md: Non-Functional Requirements / Stacking Order]** UI/UX alignment — Both toast container and modal backdrop are assigned `z-50`. If both are visible simultaneously, stacking is undefined (depends on DOM order). **Recommendation**: Assign distinct z-index values (e.g., modal backdrop `z-40` or `z-60`) or document that toasts and modals are mutually exclusive.

- **[requirements.md: Acceptance Criteria]** Coverage gap — Functional requirements SC-03 (lazy loading), SC-12 (i18n key namespaces), SC-16 (EmptyState component props), SC-17 (SkeletonLoader), and SC-21 (Tailwind theme variables) have no dedicated acceptance criterion. **Recommendation**: Add acceptance criteria for each, or note which existing criteria cover them transitively.

- **[requirements.md: Acceptance Criteria]** Traceability — Criteria #20-23 (`npm run type-check`, `lint`, `format:check`, `build`) are not traced to any requirement ID. They are quality gates inherited from Phase 00. **Recommendation**: Either add a non-functional requirement (e.g., "NFR-BUILD: All quality gates pass") and reference it, or note these are inherited from Phase 00.

- **[requirements.md: SC-17]** Convention compliance — References `bg-surface` Tailwind class. SC-21 adds `--color-success` and `--color-error` to the theme but not `--color-surface`. If `bg-surface` is not already defined from Phase 00, this will fail. **Recommendation**: Verify `bg-surface` exists in the Tailwind theme from Phase 00, or add it to SC-21.

- **[requirements.md: Non-Functional Requirements]** NFR measurability — Several NFRs lack measurable thresholds and are rules/constraints rather than metrics: "i18n mandatory," "File naming: kebab-case," "Tailwind only," "Coverage target: all composables/components must have tests" (no percentage). **Recommendation**: Move rule-based items to a Constraints section; keep NFR for measurable quality attributes.

- **[plan.md: Phase 2 Step 4]** Completeness — The translations table lists `nav.*`, `common.*`, and `toast.*` keys but omits the `page.*.title` keys despite the prose saying they "mirror nav._ values initially." An implementer following the table would miss 5 keys. **Recommendation**: Add the 5 `page._.title` keys to the table with explicit values.

- **[plan.md: Phase 4 Step 7 / Phase 2]** i18n completeness — Step 7 references `$t('app.title')` but Phase 2's translations table does not list it, nor does it note that `app.title` already exists from Phase 00. **Recommendation**: Add a note that `app.title` is inherited from Phase 00 locale files.

- **[plan.md: Phase 8 Step 19]** UI/UX alignment — The fade transition CSS does not include a `@media (prefers-reduced-motion: reduce)` block. SC-09 and ui-ux.md both require respecting this media query. **Recommendation**: Add a reduced-motion media query that disables or zeroes transition duration.

- **[plan.md: Phase 5 Steps 13-14 / Phase 8 Step 19]** Completeness — Step 19 defines only the route fade transition CSS. The toast slide-from-right animation and modal fade+scale transition CSS classes are never defined in any step. **Recommendation**: Add toast and modal transition CSS to Step 19 or create a dedicated step.

- **[plan.md: Phase 4 Step 10]** Consistency — Bottom nav described as "hidden by default, `max-md:fixed`." With desktop-first design, `max-md:fixed` sets `position: fixed` but does not override `display: none` from `hidden`. The bottom nav would never be visible. **Recommendation**: Specify the full class set: e.g., `hidden max-md:fixed max-md:block`.

- **[plan.md: Phase 4 Step 9]** Consistency with requirements — Step 9 describes the page header but does not mention sticky positioning. SC-08 requires "Sticky header at the top of the content area." **Recommendation**: Add `sticky top-0` to the page header specification.

- **[plan.md + scenarios.md: Phase 2 / i18n scenarios]** i18n quality — Spanish and French translations are missing diacritics: "Estadisticas" should be "Estadísticas", "Bibliotheque" should be "Bibliothèque", "Parametres" should be "Paramètres", "todavia" should be "todavía", "salio" should be "salió", "Ocurrio" should be "Ocurrió", "Reessayer" should be "Réessayer". These will propagate to locale JSON files if copied verbatim. **Recommendation**: Add correct Unicode diacritics to all translations.

- **[scenarios.md: All sections]** Traceability — No scenarios reference requirement IDs (SC-\*). This makes it harder to trace coverage and identify gaps. **Recommendation**: Add requirement ID references to scenario section headers (e.g., "### Routing [SC-01, SC-02, SC-03]").

- **[plan.md: Phase 4-5 / Phase 8 Step 18]** Completeness — The plan mounts `<ToastContainer>` globally in app-shell.vue but never specifies where `<ModalDialog>` is placed in the component tree. The modal needs global mounting to work from any view. **Recommendation**: Add `<ModalDialog />` to app-shell.vue or App.vue in Step 10 or Step 18.

### Suggestions

- **[requirements.md: SC-14]** UI/UX alignment — SC-14 says "slide-in from right, fade-out." The ui-ux.md says "slide in from top-right." These are slightly different animations. **Recommendation**: Align with ui-ux.md's "top-right" description.

- **[requirements.md: SC-07]** Glossary alignment — Uses "teal" while ui-ux.md defines the accent as "Cyan/teal (\~teal-500 / #14b8a6)." **Recommendation**: Use "accent color" consistently or specify the exact Tailwind class.

- **[requirements.md]** Section completeness — Missing "Risks & Assumptions" section. For a critical infrastructure feature underpinning all future development, documenting risks (e.g., co-located tests vs. convention, jsdom limitations) and assumptions (e.g., Firebase SPA rewrite working) would strengthen the document. **Recommendation**: Add a brief Risks & Assumptions section.

- **[requirements.md]** Section completeness — Several NFR items (architecture compliance, SFC block order, file naming, Tailwind only) are constraints inherited from conventions.md rather than phase-specific quality attributes. **Recommendation**: Add a Constraints section and relocate these items.

- **[plan.md: Phase 5 Step 12]** Completeness — Empty state props listed as `icon`, `title`, `description` but SC-16 and ui-ux.md also specify an optional CTA button. **Recommendation**: Add an optional action/CTA prop.

- **[plan.md: Phase 3 and 5]** Convention compliance — conventions.md requires JSDoc on all public functions. The plan does not mention adding JSDoc to any new composables or component exports. **Recommendation**: Add a note that all exported functions must have JSDoc comments.

- **[plan.md: Phase 9]** Testing alignment — The plan does not include a step to update `vitest.config.ts` with `globals: true` or `setupFiles` as specified by testing.md. **Recommendation**: Add a step to configure vitest properly.

- **[scenarios.md: Placeholder views]** Coverage — Only one route (`/stats`) is tested for placeholder view rendering. SC-20 requires all 5 views to render EmptyState. **Recommendation**: Convert to a Scenario Outline parameterized across all 5 routes.

- **[scenarios.md: Modal]** Edge cases — Missing cancel callback scenario and double-open behavior. **Recommendation**: Add a scenario for the cancel button invoking `onCancel` and a negative scenario for calling `open()` while already open.

- **[scenarios.md: Empty state]** Edge cases — Only one scenario. Missing coverage for optional CTA prop and omitted optional props. **Recommendation**: Add scenarios for CTA rendering and prop combinations.

- **[scenarios.md: Global error handler]** Edge cases — Scenario only covers component-lifecycle errors. `app.config.errorHandler` does not catch unhandled promise rejections. **Recommendation**: Clarify scope or add a scenario for `window.addEventListener('unhandledrejection', ...)`.

- **[index.md]** Description accuracy — Requirements link description ("routing, layout, navigation, and reusable UI primitives") omits error handling, toast system, modal, testing, and NFRs. **Recommendation**: Broaden the description or keep concise with an "and more" qualifier.

## Missing Coverage

- **SC-21 (Tailwind theme additions)** has no scenario verifying that `--color-success` and `--color-error` are defined and render correctly.
- **SC-22 through SC-26 (testing requirements)** have no scenarios verifying test structure or existence — only that `npm run test` passes.
- **EmptyState CTA prop** is specified in requirements but absent from both the plan's component spec and scenarios.
- **Toast and modal transition CSS** are described in requirements but never defined in any plan step.
- **vitest.config.ts updates** (globals, include, setupFiles) are not planned despite being required by testing.md.

## Open Questions

- **[requirements.md: SC-21]** — Does `bg-surface` already exist in the Tailwind theme from Phase 00? If not, it needs to be added alongside `--color-success` and `--color-error`.

- **[requirements.md: Decisions]** — Is the nav item order (Home, Library, Stats, Calendar, Settings) intentional? The ui-ux.md places Calendar before Library. Should the scaffolding phase follow the ui-ux.md order (with Stats swapped in for Recommendations)?

- **[plan.md: Phase 4 Step 10]** — The bottom nav responsive classes as described (`hidden`, `max-md:fixed`) will produce a permanently hidden element. Is this a documentation error, or is there additional CSS intended?

## Ideas & Suggestions

- **Vitest configuration step**: The plan is missing a step to update `vitest.config.ts` with the correct `include`, `globals`, and `setupFiles` settings. Whichever test location is chosen, the config must be explicitly aligned — the current default glob would work for co-located tests but diverges from the documented setup.

- **Modal accessibility**: SC-15 omits focus trapping (consistent with ui-ux.md's minimal accessibility scope), but a modal without focus trapping creates a confusing keyboard experience. Consider using the `inert` attribute on background content as a lightweight alternative, or document this as a known limitation.

- **Toast queue overflow**: Neither requirements nor scenarios address what happens when many toasts arrive in rapid succession (e.g., during repeated network errors). Consider adding a maximum visible toast count (e.g., 5) with FIFO eviction, and a scenario for burst conditions.

- **Scroll behavior on Back button**: SC-11's `scrollBehavior` returns `{ top: 0 }` unconditionally, meaning browser Back navigation will also scroll to top rather than restoring position. Document this as an intentional trade-off, or plan to use `savedPosition` for back/forward navigation.

- **Global error handler i18n context**: Plan Step 16's `app.config.errorHandler` calls `i18n.global.t()` and `useToast().addToast()`. The implementation note should clarify that `i18n` must be imported from the i18n module (not via `useI18n()`) since the error handler runs outside component `setup()` context.
