import { describe, it, expect, beforeEach } from 'vitest'
import { useModal, _resetForTesting } from '@/presentation/composables/use-modal'
import type { ModalProps } from '@/presentation/composables/use-modal'

describe('useModal', () => {
  beforeEach(() => {
    _resetForTesting()
  })

  // SC-12-01, SC-23-04 — open(props) sets isOpen to true and stores props
  it('opens a modal with provided props', () => {
    // Arrange
    const { isOpen, props, open } = useModal()

    // Act
    open({ title: 'Confirm Action', content: 'Are you sure?' })

    // Assert
    expect(isOpen.value).toBe(true)
    expect(props.value).not.toBeNull()
    const p = props.value as ModalProps
    expect(p.title).toBe('Confirm Action')
    expect(p.content).toBe('Are you sure?')
  })

  // SC-12-02, SC-23-04 — close() sets isOpen to false and clears props to null
  it('closes a modal and clears props', () => {
    // Arrange
    const { isOpen, props, open, close } = useModal()
    open({ title: 'Confirm Action' })

    // Act
    close()

    // Assert
    expect(isOpen.value).toBe(false)
    expect(props.value).toBeNull()
  })

  // SC-12-03, SC-23-07 — opening a second modal replaces the first
  it('replaces the current modal when opening a second one', () => {
    // Arrange
    const { isOpen, props, open } = useModal()
    open({ title: 'First' })

    // Act
    open({ title: 'Second' })

    // Assert
    expect(isOpen.value).toBe(true)
    const p = props.value as ModalProps
    expect(p.title).toBe('Second')
  })

  // SC-23-05 — onConfirm callback is stored and accessible in modal props
  it('stores the onConfirm callback in props', () => {
    // Arrange
    const { props, open } = useModal()
    const onConfirm = () => {}

    // Act
    open({ title: 'Delete Item', onConfirm })

    // Assert
    const p = props.value as ModalProps
    expect(p.onConfirm).toBe(onConfirm)
  })

  // SC-23-06 — onCancel callback is stored and accessible in modal props
  it('stores the onCancel callback in props', () => {
    // Arrange
    const { props, open } = useModal()
    const onCancel = () => {}

    // Act
    open({ title: 'Delete Item', onCancel })

    // Assert
    const p = props.value as ModalProps
    expect(p.onCancel).toBe(onCancel)
  })

  // SC-12-04, SC-23-10 — close() when no modal is open has no effect
  it('does nothing when closing an already closed modal', () => {
    // Arrange
    const { isOpen, props, close } = useModal()

    // Act & Assert
    expect(() => close()).not.toThrow()
    expect(isOpen.value).toBe(false)
    expect(props.value).toBeNull()
  })

  // SC-12-05 — open(props) with confirmLabel and cancelLabel stores the labels
  it('stores confirmLabel and cancelLabel in props', () => {
    // Arrange
    const { props, open } = useModal()

    // Act
    open({ title: 'Delete Item', confirmLabel: 'Delete', cancelLabel: 'Keep' })

    // Assert
    const p = props.value as ModalProps
    expect(p.confirmLabel).toBe('Delete')
    expect(p.cancelLabel).toBe('Keep')
  })

  // Implementation detail — props include all optional fields
  it('stores all optional fields in props', () => {
    // Arrange
    const { props, open } = useModal()
    const onConfirm = () => {}
    const onCancel = () => {}

    // Act
    open({
      title: 'Full Modal',
      content: 'Details here',
      confirmLabel: 'OK',
      cancelLabel: 'Cancel',
      onConfirm,
      onCancel,
    })

    // Assert
    expect(props.value).toEqual({
      title: 'Full Modal',
      content: 'Details here',
      confirmLabel: 'OK',
      cancelLabel: 'Cancel',
      onConfirm,
      onCancel,
    })
  })
})
