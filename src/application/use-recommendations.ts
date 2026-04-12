import { ref, onMounted } from 'vue'
import { useLibraryEntries } from '@/application/use-library-entries'
import { selectSeeds, deduplicateRecommendations } from '@/domain/recommendations.logic'
import {
  getMovieRecommendations,
  getShowRecommendations,
  getTrending,
  getPopularMovies,
  getPopularShows,
} from '@/infrastructure/provider.client'
import type { LibraryEntry } from '@/domain/library.schema'
import type { SearchResultItem } from '@/domain/search.schema'
import { useSettings } from '@/application/use-settings'

export interface RecommendationSection {
  seed?: LibraryEntry
  titleKey?: string
  titleParams?: Record<string, string>
  results: SearchResultItem[]
  loading: boolean
  error: Error | null
  fetched: boolean
}

/**
 * Composable for managing personalized recommendations.
 * Fetches seeds from library and coordinates API calls for each section.
 */
export function useRecommendations() {
  const { allEntries } = useLibraryEntries()
  const { language } = useSettings()
  const sections = ref<RecommendationSection[]>([])
  const loading = ref(true)
  const libraryIds = ref(new Set<number>())

  /**
   * Initializes the sections based on library seeds or fallbacks.
   */
  const initSections = () => {
    loading.value = true
    const seeds = selectSeeds(allEntries.value)
    libraryIds.value = new Set(allEntries.value.map((e) => e.id))

    if (seeds.length === 0) {
      sections.value = [
        {
          titleKey: 'recommendations.trending.title',
          results: [],
          loading: false,
          error: null,
          fetched: false,
        },
        {
          titleKey: 'recommendations.popular.movies.title',
          results: [],
          loading: false,
          error: null,
          fetched: false,
        },
        {
          titleKey: 'recommendations.popular.shows.title',
          results: [],
          loading: false,
          error: null,
          fetched: false,
        },
      ]
    } else {
      sections.value = seeds.map((seed) => {
        const isLiked = seed.rating >= 3
        return {
          seed,
          titleKey: isLiked
            ? 'recommendations.becauseYouLiked'
            : 'recommendations.becauseYouWatched',
          titleParams: { title: seed.title },
          results: [],
          loading: false,
          error: null,
          fetched: false,
        }
      })
    }
    loading.value = false
  }

  /**
   * Fetches data for a specific section.
   * Handles deduplication against previously fetched sections.
   */
  const fetchSection = async (index: number) => {
    const section = sections.value[index]
    if (!section || section.fetched || section.loading) return

    section.loading = true
    section.error = null

    try {
      let results: SearchResultItem[] = []

      if (section.seed) {
        const response =
          section.seed.mediaType === 'movie'
            ? await getMovieRecommendations(section.seed.id, language.value)
            : await getShowRecommendations(section.seed.id, language.value)
        results = response.results
      } else {
        // Fallback sections
        if (section.titleKey === 'recommendations.trending.title') {
          results = (await getTrending(language.value)).results
        } else if (section.titleKey === 'recommendations.popular.movies.title') {
          results = (await getPopularMovies(language.value)).results
        } else if (section.titleKey === 'recommendations.popular.shows.title') {
          results = (await getPopularShows(language.value)).results
        }
      }

      results = results.filter((item) => item.media_type === 'movie' || item.media_type === 'tv')

      // Deduplicate against library AND other ALREADY FETCHED sections
      const otherSectionsResults = sections.value
        .filter((_, i) => i !== index && sections.value[i].fetched)
        .map((s) => s.results)

      const deduplicated = deduplicateRecommendations(
        [results, ...otherSectionsResults],
        libraryIds.value,
      )

      section.results = deduplicated[0]
      section.fetched = true
    } catch (e) {
      console.error(`Failed to fetch recommendation section ${index}:`, e)
      section.error = e as Error
    } finally {
      section.loading = false
    }
  }

  onMounted(initSections)

  return {
    sections,
    loading,
    fetchSection,
    refresh: initSections,
  }
}
