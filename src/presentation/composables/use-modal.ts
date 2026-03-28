import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'

/** Props passed to the modal when opening it. */
export interface ModalProps {
  /** Modal title text. */
  title: string
  /** Optional body content text. */
  content?: string
  /** Label for the confirm button (e.g., "Delete", "OK"). */
  confirmLabel?: string
  /** Label for the cancel button (e.g., "Keep", "Cancel"). */
  cancelLabel?: string
  /** Callback stored in props; invocation is the consuming component's responsibility. */
  onConfirm?: () => void
  /** Callback stored in props; invocation is the consuming component's responsibility. */
  onCancel?: () => void
}

// Module-level singleton state — shared across all callers, works outside setup()
const isOpen = ref(false)
const props = shallowRef<ModalProps | null>(null)

/**
 * Composable for managing single-instance modal dialog state.
 *
 * Uses module-level singleton state so it works both inside and outside
 * Vue component `setup()`. Only one modal can be active at a time;
 * opening a new modal replaces the current one.
 *
 * @returns Reactive modal state and methods to open/close the modal.
 */
export function useModal(): {
  isOpen: Readonly<Ref<boolean>>
  props: Readonly<ShallowRef<ModalProps | null>>
  open: (modalProps: ModalProps) => void
  close: () => void
} {
  return { isOpen, props, open, close }
}

/**
 * Opens the modal with the given props. If a modal is already open,
 * it is replaced (single-instance behavior).
 *
 * @param modalProps - Configuration for the modal (title, content, callbacks, labels).
 */
function open(modalProps: ModalProps): void {
  isOpen.value = true
  props.value = modalProps
}

/**
 * Closes the modal and clears stored props. No-op if no modal is open.
 */
function close(): void {
  isOpen.value = false
  props.value = null
}

/**
 * Resets all composable state. For use in tests only.
 * @internal
 */
export function _resetForTesting(): void {
  isOpen.value = false
  props.value = null
}
