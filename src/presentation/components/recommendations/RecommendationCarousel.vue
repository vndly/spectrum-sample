<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useIntersectionObserver } from '@/presentation/composables/use-intersection-observer'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'
import type { SearchResultItem } from '@/domain/search.schema'

defineProps<{
  titleKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titleParams?: Record<string, any>
  items: SearchResultItem[]
  loading: boolean
  error: Error | null
  fetched: boolean
}>()

const emit = defineEmits<{
  (e: 'intersect'): void
}>()

const router = useRouter()
const { t } = useI18n()
const sectionRef = ref<HTMLElement | null>(null)
const carouselRef = ref<HTMLElement | null>(null)
const { observe, isIntersecting } = useIntersectionObserver(sectionRef)

onMounted(() => {
  observe()
})

// When the component is about to enter viewport, emit intersect to parent
watch(isIntersecting, (val) => {
  if (val) {
    emit('intersect')
  }
})

function handleItemClick(item: SearchResultItem) {
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  router.push(path)
}

function getTitle(item: SearchResultItem) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'title' in item ? (item as any).title : (item as any).name
}

function getPosterUrl(item: SearchResultItem) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return buildImageUrl((item as any).poster_path, IMAGE_SIZES.poster.medium)
}

/**
 * Scrolls the carousel in the requested direction.
 */
function scrollCarousel(direction: 'previous' | 'next') {
  if (!carouselRef.value) {
    return
  }

  const offset = Math.max(carouselRef.value.clientWidth * 0.85, 280)
  carouselRef.value.scrollBy({
    left: direction === 'next' ? offset : -offset,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section ref="sectionRef" class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h3 class="text-lg font-bold text-white">
        <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
        {{ t(titleKey, titleParams as any) }}
      </h3>

      <div v-if="!loading && !error && fetched && items.length > 1" class="flex items-center gap-2">
        <button
          data-testid="recommendation-scroll-previous"
          type="button"
          :aria-label="t('recommendations.scrollPrevious')"
          class="flex size-10 items-center justify-center rounded-full border border-slate-700 bg-surface text-slate-300 transition-colors hover:border-teal-500/50 hover:bg-surface-hover hover:text-white"
          @click="scrollCarousel('previous')"
        >
          <ChevronLeft class="size-5" />
        </button>
        <button
          data-testid="recommendation-scroll-next"
          type="button"
          :aria-label="t('recommendations.scrollNext')"
          class="flex size-10 items-center justify-center rounded-full border border-slate-700 bg-surface text-slate-300 transition-colors hover:border-teal-500/50 hover:bg-surface-hover hover:text-white"
          @click="scrollCarousel('next')"
        >
          <ChevronRight class="size-5" />
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-if="error"
      class="flex flex-col items-center justify-center p-8 rounded-lg bg-surface border border-red-500/20 text-center"
    >
      <p class="text-slate-400 mb-4">{{ t('errors.generic') }}</p>
      <button
        class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        @click="$emit('intersect')"
      >
        {{ t('common.retry') }}
      </button>
    </div>

    <!-- Skeleton loader (while loading OR waiting for first fetch) -->
    <div v-else-if="loading || (!fetched && !error)" class="flex gap-4 overflow-hidden">
      <div
        v-for="n in 6"
        :key="n"
        class="aspect-[2/3] w-32 md:w-40 flex-shrink-0 animate-pulse rounded-lg bg-surface"
      ></div>
    </div>

    <!-- Empty/No Results (after successful fetch) -->
    <div v-else-if="items.length === 0" class="h-4"></div>

    <!-- Scrollable carousel -->
    <div
      v-else
      ref="carouselRef"
      data-testid="recommendation-carousel"
      class="flex gap-4 overflow-x-auto pb-4 pr-2 snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="item in items as any[]"
        :key="`${item.media_type}-${item.id}`"
        class="relative aspect-[2/3] w-32 md:w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-surface transition-transform hover:scale-105 snap-start group"
        role="button"
        tabindex="0"
        @click="handleItemClick(item)"
        @keydown.enter.prevent="handleItemClick(item)"
        @keydown.space.prevent="handleItemClick(item)"
      >
        <img
          v-if="item.poster_path"
          :src="getPosterUrl(item)!"
          :alt="getTitle(item)"
          class="size-full object-cover"
          loading="lazy"
        />
        <div v-else class="size-full flex items-center justify-center bg-slate-800 text-slate-500">
          <span class="text-xs text-center px-2">{{ getTitle(item) }}</span>
        </div>

        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2"
        >
          <h4 class="truncate text-xs font-bold text-white">{{ getTitle(item) }}</h4>
        </div>
      </div>
    </div>
  </section>
</template>
