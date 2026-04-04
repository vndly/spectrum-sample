import { ref, toValue } from 'vue'
import type { Ref, MaybeRef } from 'vue'
import type { ShowDetail } from '@/domain/show.schema'
import { getShowDetail } from '@/infrastructure/provider.client'
import { useSettings } from '@/application/use-settings'

/**
 * Composable for fetching and managing TV show detail data.
 * @param id - The TMDB TV show ID (can be a ref or a plain number)
 * @returns Object containing data, loading state, error, and refresh function
 */
export function useShowDetail(id: MaybeRef<number>) {
  const { language } = useSettings()

  const data: Ref<ShowDetail | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)

  /**
   * Fetches the TV show detail from the API.
   */
  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const showId = toValue(id)
      data.value = await getShowDetail(showId, language.value)
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to fetch show details')
      data.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Refreshes the TV show detail data.
   */
  function refresh() {
    fetchData()
  }

  // Fetch data immediately
  fetchData()

  return {
    data,
    loading,
    error,
    refresh,
  }
}
