import { ref, watch } from 'vue'

export type LayoutMode = 'grid' | 'list'

/**
 * Composable for accessing user settings.
 * Currently provides a stub implementation with default values.
 * @returns Object containing language and preferredRegion settings
 */
export function useSettings() {
  const language = ref('en')
  const preferredRegion = ref('US')

  // Load layout preference from localStorage or default to 'grid'
  const savedLayout = localStorage.getItem('layoutMode') as LayoutMode | null
  const layoutMode = ref<LayoutMode>(savedLayout || 'grid')

  // Persist layout preference whenever it changes
  watch(layoutMode, (newMode) => {
    localStorage.setItem('layoutMode', newMode)
  })

  return {
    language,
    preferredRegion,
    layoutMode,
  }
}
