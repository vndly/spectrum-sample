import { describe, it, expect } from 'vitest'
import { useRecommendationFilters } from '@/application/use-recommendation-filters'
import { DEFAULT_FILTER_STATE } from '@/domain/filter.schema'

describe('useRecommendationFilters', () => {
  it('initializes with default filters', () => {
    const { filters } = useRecommendationFilters()
    expect(filters.value).toEqual(DEFAULT_FILTER_STATE)
  })

  it('updates activeFilterCount when genres are selected', () => {
    const { filters, activeFilterCount } = useRecommendationFilters()
    expect(activeFilterCount.value).toBe(0)

    filters.value.genres = [28]
    expect(activeFilterCount.value).toBe(1)

    filters.value.genres = [28, 12]
    expect(activeFilterCount.value).toBe(1) // Still counts as 1 filter category
  })

  it('updates activeFilterCount when mediaType changes', () => {
    const { filters, activeFilterCount } = useRecommendationFilters()
    expect(activeFilterCount.value).toBe(0)

    filters.value.mediaType = 'movie'
    expect(activeFilterCount.value).toBe(1)

    filters.value.mediaType = 'tv'
    expect(activeFilterCount.value).toBe(1)
  })

  it('counts multiple active filter categories', () => {
    const { filters, activeFilterCount } = useRecommendationFilters()
    expect(activeFilterCount.value).toBe(0)

    filters.value.genres = [28]
    filters.value.mediaType = 'movie'
    expect(activeFilterCount.value).toBe(2)
  })

  it('clears filters to defaults', () => {
    const { filters, clearFilters, activeFilterCount } = useRecommendationFilters()
    filters.value.genres = [28, 12]
    filters.value.mediaType = 'movie'
    expect(activeFilterCount.value).toBe(2)

    clearFilters()

    expect(filters.value).toEqual(DEFAULT_FILTER_STATE)
    expect(activeFilterCount.value).toBe(0)
  })

  it('does not count year filters in activeFilterCount', () => {
    const { filters, activeFilterCount } = useRecommendationFilters()
    filters.value.yearFrom = 2020
    filters.value.yearTo = 2024
    // Year filters are available in FilterState but not counted for recommendations
    expect(activeFilterCount.value).toBe(0)
  })
})
