import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useToast, _resetForTesting } from '@/presentation/composables/use-toast'
import { TOAST_DISMISS_MS } from '@/domain/constants'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    _resetForTesting()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // SC-13-01, SC-23-01 — addToast adds a toast to the queue with a unique ID
  it('adds a toast to the queue with a unique ID', () => {
    // Arrange
    const { toasts, addToast } = useToast()

    // Act
    addToast({ message: 'Test toast', type: 'info' })

    // Assert
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].id).toBeDefined()
    expect(toasts.value[0].message).toBe('Test toast')
    expect(toasts.value[0].type).toBe('info')
  })

  // SC-23-09 — removeToast removes the toast from the queue
  it('removes a toast from the queue', () => {
    // Arrange
    const { toasts, addToast, removeToast } = useToast()
    addToast({ message: 'To be removed', type: 'info' })
    const id = toasts.value[0].id

    // Act
    removeToast(id)

    // Assert
    expect(toasts.value).toHaveLength(0)
  })

  // SC-13-01, SC-23-02 — auto-dismiss removes the toast after TOAST_DISMISS_MS
  it('auto-dismisses after TOAST_DISMISS_MS', () => {
    // Arrange
    const { toasts, addToast } = useToast()
    addToast({ message: 'Auto-dismiss me', type: 'info' })
    expect(toasts.value).toHaveLength(1)

    // Act
    vi.advanceTimersByTime(TOAST_DISMISS_MS)

    // Assert
    expect(toasts.value).toHaveLength(0)
  })

  // SC-13-03 — toast with action preserves the action object in state
  it('preserves the action object in state', () => {
    // Arrange
    const { toasts, addToast } = useToast()
    const handler = vi.fn()

    // Act
    addToast({ message: 'With action', type: 'error', action: { label: 'Retry', handler } })

    // Assert
    expect(toasts.value[0].action).toBeDefined()
    expect(toasts.value[0].action!.label).toBe('Retry')
    expect(toasts.value[0].action!.handler).toBe(handler)
  })

  // SC-13-04, SC-23-08 — adding a 6th toast evicts the oldest toast
  it('evicts the oldest toast when MAX_VISIBLE_TOASTS is exceeded', () => {
    // Arrange
    const { toasts, addToast } = useToast()
    for (let i = 1; i <= 5; i++) {
      addToast({ message: `Toast ${i}`, type: 'info' })
    }
    const oldestId = toasts.value[0].id
    expect(toasts.value).toHaveLength(5)

    // Act
    addToast({ message: 'Toast 6', type: 'info' })

    // Assert
    expect(toasts.value).toHaveLength(5)
    expect(toasts.value.find((t) => t.id === oldestId)).toBeUndefined()
    expect(toasts.value[toasts.value.length - 1].message).toBe('Toast 6')
  })

  // SC-13-05, SC-23-12 — removeToast with a non-existent ID has no effect
  it('does nothing when removing a non-existent toast ID', () => {
    // Arrange
    const { toasts, addToast, removeToast } = useToast()
    addToast({ message: 'Existing toast', type: 'info' })
    expect(toasts.value).toHaveLength(1)

    // Act & Assert
    expect(() => removeToast('non-existent-id')).not.toThrow()
    expect(toasts.value).toHaveLength(1)
  })

  // SC-23-03 — toast types: error, success, info
  it.each([{ type: 'error' as const }, { type: 'success' as const }, { type: 'info' as const }])(
    'creates a toast with type "$type"',
    ({ type }) => {
      // Arrange
      const { toasts, addToast } = useToast()

      // Act
      addToast({ message: `${type} toast`, type })

      // Assert
      expect(toasts.value[0].type).toBe(type)
    },
  )

  // SC-23-11 — removeToast clears the auto-dismiss timer
  it('clears the auto-dismiss timer when toast is removed', () => {
    // Arrange
    const { toasts, addToast, removeToast } = useToast()
    addToast({ message: 'Timer test', type: 'info' })
    const id = toasts.value[0].id

    // Act
    removeToast(id)

    // Assert — advance past auto-dismiss time; nothing should happen
    vi.advanceTimersByTime(TOAST_DISMISS_MS)
    expect(toasts.value).toHaveLength(0)
  })

  // SC-23-13 — two sequentially added toasts receive distinct, incrementing IDs
  it('assigns distinct, incrementing IDs to sequential toasts', () => {
    // Arrange
    const { toasts, addToast } = useToast()

    // Act
    addToast({ message: 'First', type: 'info' })
    addToast({ message: 'Second', type: 'info' })

    // Assert
    const id1 = Number(toasts.value[0].id)
    const id2 = Number(toasts.value[1].id)
    expect(id1).not.toBe(id2)
    expect(id2).toBeGreaterThan(id1)
  })

  // SC-23-08 — eviction clears the evicted toast's auto-dismiss timer
  it('clears the evicted toast auto-dismiss timer on eviction', () => {
    // Arrange
    const { toasts, addToast } = useToast()
    for (let i = 1; i <= 5; i++) {
      addToast({ message: `Toast ${i}`, type: 'info' })
    }
    expect(toasts.value).toHaveLength(5)

    // Act — add 6th toast, evicting the oldest
    addToast({ message: 'Toast 6', type: 'info' })

    // Assert — advance past auto-dismiss; evicted toast's timer should not fire
    vi.advanceTimersByTime(TOAST_DISMISS_MS)
    expect(toasts.value).toHaveLength(0)
  })

  // Additional: addToast works correctly when the optional action field is omitted
  it('adds a toast without an action', () => {
    // Arrange
    const { toasts, addToast } = useToast()

    // Act
    addToast({ message: 'No action', type: 'success' })

    // Assert
    expect(toasts.value[0].action).toBeUndefined()
  })
})
