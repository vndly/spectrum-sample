import { ref, type Readonly, type Ref } from 'vue'
import { TOAST_DISMISS_MS, MAX_VISIBLE_TOASTS } from '@/domain/constants'

/** A toast notification entry. */
export interface Toast {
  /** Unique identifier (incrementing counter as string). */
  id: string
  /** Message displayed to the user. */
  message: string
  /** Visual style: error (red), success (green), info (teal). */
  type: 'error' | 'success' | 'info'
  /** Optional action button shown alongside the dismiss button. */
  action?: {
    /** Button label text. */
    label: string
    /** Callback invoked when the action button is clicked. */
    handler: () => void
  }
}

// Module-level singleton state — shared across all callers, works outside setup()
const toasts = ref<Toast[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()
let nextId = 1

/**
 * Composable for managing toast notifications.
 *
 * Uses module-level singleton state so it works both inside and outside
 * Vue component `setup()` (e.g., from the global error handler).
 *
 * @returns Reactive toast queue and methods to add/remove toasts.
 */
export function useToast(): {
  toasts: Readonly<Ref<Toast[]>>
  addToast: (options: {
    message: string
    type: 'error' | 'success' | 'info'
    action?: { label: string; handler: () => void }
  }) => void
  removeToast: (id: string) => void
} {
  return { toasts, addToast, removeToast }
}

/**
 * Adds a toast to the queue with a unique ID and starts an auto-dismiss timer.
 *
 * When the queue exceeds `MAX_VISIBLE_TOASTS`, the oldest toast is evicted
 * and its auto-dismiss timer is cleared.
 *
 * @param options - Toast configuration: message, type, and optional action.
 */
function addToast(options: {
  message: string
  type: 'error' | 'success' | 'info'
  action?: { label: string; handler: () => void }
}): void {
  const id = String(nextId++)

  const toast: Toast = {
    id,
    message: options.message,
    type: options.type,
    action: options.action,
  }

  // Evict oldest toast if at capacity
  if (toasts.value.length >= MAX_VISIBLE_TOASTS) {
    const oldest = toasts.value[0]
    const oldestTimer = timers.get(oldest.id)
    if (oldestTimer !== undefined) {
      clearTimeout(oldestTimer)
      timers.delete(oldest.id)
    }
    toasts.value.splice(0, 1)
  }

  toasts.value.push(toast)

  // Start auto-dismiss timer
  const timer = setTimeout(() => {
    removeToast(id)
  }, TOAST_DISMISS_MS)
  timers.set(id, timer)
}

/**
 * Removes a toast from the queue by ID and clears its auto-dismiss timer.
 *
 * If the ID does not match any toast, this is a no-op.
 *
 * @param id - The unique toast identifier.
 */
function removeToast(id: string): void {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index === -1) return

  toasts.value.splice(index, 1)

  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

/**
 * Resets all composable state. For use in tests only.
 * @internal
 */
export function _resetForTesting(): void {
  toasts.value = []
  for (const timer of timers.values()) {
    clearTimeout(timer)
  }
  timers.clear()
  nextId = 1
}
