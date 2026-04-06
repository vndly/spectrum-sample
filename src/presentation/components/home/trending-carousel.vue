<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { MediaResult } from '@/application/use-browse'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

defineProps<{
  items: MediaResult[]
  loading: boolean
}>()

const router = useRouter()
const { t } = useI18n()

/**
 * Navigates to the detail page for the given item.
 */
function handleItemClick(item: MediaResult) {
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  router.push(path)
}

/**
 * Returns the title for movies or name for TV shows.
 */
function getTitle(item: MediaResult) {
  return 'title' in item ? item.title : item.name
}

/**
 * Returns the backdrop URL with fallbacks.
 */
function getBackdropUrl(item: MediaResult) {
  return buildImageUrl(item.backdrop_path || item.poster_path, IMAGE_SIZES.backdrop.medium)
}
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white">{{ t('home.browse.trending') }}</h2>

    <!-- Skeleton loader during initial fetch -->
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <div
        v-for="n in 3"
        :key="n"
        class="aspect-video w-64 flex-shrink-0 animate-pulse rounded-lg bg-surface"
      ></div>
    </div>

    <!-- Scrollable carousel -->
    <div
      v-else
      data-testid="trending-carousel"
      class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
    >
      <div
        v-for="item in items"
        :key="`${item.media_type}-${item.id}`"
        class="relative aspect-video w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-surface transition-transform hover:scale-105 snap-start"
        role="button"
        tabindex="0"
        :aria-label="getTitle(item)"
        @click="handleItemClick(item)"
        @keydown.enter.prevent="handleItemClick(item)"
        @keydown.space.prevent="handleItemClick(item)"
      >
        <img
          :src="getBackdropUrl(item)"
          :alt="getTitle(item)"
          class="size-full object-cover"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3"
        >
          <h3 class="truncate text-sm font-bold text-white">{{ getTitle(item) }}</h3>
          <p class="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
            {{ item.media_type }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
