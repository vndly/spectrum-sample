<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIntersectionObserver } from '@/presentation/composables/use-intersection-observer'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'
import type { SearchResult } from '@/domain/search.schema'

defineProps<{
  titleKey: string
  titleParams?: Record<string, string>
  items: SearchResult[]
  loading: boolean
  error: Error | null
  fetched: boolean
}>()

const emit = defineEmits<{
  (e: 'intersect'): void
}>()

const router = useRouter()
const { t } = useI18n()
const carouselRef = ref<HTMLElement | null>(null)
const { observe, isIntersecting } = useIntersectionObserver(carouselRef)

onMounted(() => {
  observe()
})

// When the component is about to enter viewport, emit intersect to parent
watch(isIntersecting, (val) => {
  if (val) {
    emit('intersect')
  }
})

function handleItemClick(item: SearchResult) {
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  router.push(path)
}

function getTitle(item: SearchResult) {
  return 'title' in item ? item.title : item.name
}

function getPosterUrl(item: SearchResult) {
  return buildImageUrl(item.poster_path, IMAGE_SIZES.poster.medium)
}
</script>

<template>
  <section ref="carouselRef" class="space-y-4">
    <h3 class="text-lg font-bold text-white">
      {{ t(titleKey, titleParams) }}
    </h3>

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
    <div v-else class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      <div
        v-for="item in items"
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
          :src="getPosterUrl(item)"
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

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
