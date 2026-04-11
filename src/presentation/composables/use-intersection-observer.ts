import { ref, onUnmounted, type Ref } from 'vue'

/**
 * Composable for observing if an element is in view.
 * Useful for lazy loading carousels or images.
 */
export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '200px' },
) {
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  const observe = () => {
    if (!target.value) return

    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
      if (entry.isIntersecting && observer && target.value) {
        // Once intersected, we can stop observing if we only want to load once
        observer.unobserve(target.value)
        observer.disconnect()
        observer = null
      }
    }, options)

    observer.observe(target.value)
  }

  const unobserve = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onUnmounted(unobserve)

  return {
    isIntersecting,
    observe,
    unobserve,
  }
}
