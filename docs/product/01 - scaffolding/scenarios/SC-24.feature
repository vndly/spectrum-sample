Feature: SC-24 — UI primitive tests
  UI primitive component tests SHALL verify rendering and behavior.
  Note: This feature covers EmptyState, SkeletonLoader, ErrorBoundary, ToastContainer, and ModalDialog.

  Scenario: SC-24-01 — EmptyState component test suite
    Given the EmptyState test file exists at tests/presentation/components/common/empty-state.test.ts
    When the test suite runs
    Then it verifies rendering with all props (icon, title, description, CTA)
    And it verifies rendering with only the title prop
    And it verifies CTA button click invokes the handler
    And it verifies no CTA renders without ctaAction

  Scenario: SC-24-02 — SkeletonLoader component test suite
    Given the SkeletonLoader test file exists at tests/presentation/components/common/skeleton-loader.test.ts
    When the test suite runs
    Then it verifies rendering with specified dimensions
    And it verifies the pulsing shimmer animation
    And it verifies custom rounded prop
    And it verifies default prop values
    And it verifies aria-hidden="true" on the rendered div

  Scenario: SC-24-03 — ErrorBoundary renders slot in normal state
    Given the ErrorBoundary component wraps child content
    When no error occurs
    Then the child content is displayed normally

  @coverage: toast queue rendering, dismiss button removal, type-colored borders,
  @coverage: enter/leave transitions, max-toast eviction, auto-dismiss, container positioning
  Scenario: SC-24-04 — ToastContainer component test
    Given the test file tests/presentation/components/common/toast-container.test.ts exists
    When the test suite runs
    Then all tests pass

  @coverage: title/content/buttons rendering, backdrop click close, Escape key close,
  @coverage: confirm/cancel callbacks, modal replacement, open/close transitions
  Scenario: SC-24-05 — ModalDialog component test
    Given the test file tests/presentation/components/common/modal-dialog.test.ts exists
    When the test suite runs
    Then all tests pass

  Scenario: SC-24-06 — ErrorBoundary shows fallback on error
    Given the ErrorBoundary component wraps a failing child
    When the child throws an error
    Then the full-screen fallback UI is displayed with error heading, description, a primary reload button, and `role="alert"`
