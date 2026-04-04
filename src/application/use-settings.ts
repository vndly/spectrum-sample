import { ref } from 'vue'

/**
 * Composable for accessing user settings.
 * Currently provides a stub implementation with default values.
 * @returns Object containing language and preferredRegion settings
 */
export function useSettings() {
  const language = ref('en')
  const preferredRegion = ref('US')

  return {
    language,
    preferredRegion,
  }
}
