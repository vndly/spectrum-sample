import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSort } from '@/application/use-sort'
import * as storageService from '@/infrastructure/storage.service'

vi.mock('@/infrastructure/storage.service', () => ({
  getSettings: vi.fn(),
  saveSettings: vi.fn(),
}))

describe('useSort', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(storageService.getSettings).mockReturnValue({
      language: 'en',
      preferredRegion: 'US',
      layoutMode: 'grid',
      theme: 'dark',
      defaultHomeSection: 'trending',
      librarySortField: 'dateAdded',
      librarySortOrder: 'desc',
    })
  })

  it('initializes from persisted sort settings', () => {
    const { sortField, sortOrder } = useSort()

    expect(sortField.value).toBe('dateAdded')
    expect(sortOrder.value).toBe('desc')
  })

  it('falls back to defaults when sort settings are missing', () => {
    vi.mocked(storageService.getSettings).mockReturnValue({
      language: 'en',
      preferredRegion: 'US',
      layoutMode: 'grid',
      theme: 'dark',
      defaultHomeSection: 'trending',
      librarySortField: undefined,
      librarySortOrder: undefined,
    })

    const { sortField, sortOrder } = useSort()

    expect(sortField.value).toBe('dateAdded')
    expect(sortOrder.value).toBe('desc')
  })

  it('persists field and order changes back to settings storage', async () => {
    const { sortField, sortOrder } = useSort()

    sortField.value = 'title'
    await nextTick()
    sortOrder.value = 'asc'
    await nextTick()

    expect(storageService.saveSettings).toHaveBeenLastCalledWith({
      language: 'en',
      preferredRegion: 'US',
      layoutMode: 'grid',
      theme: 'dark',
      defaultHomeSection: 'trending',
      librarySortField: 'title',
      librarySortOrder: 'asc',
    })
  })
})
