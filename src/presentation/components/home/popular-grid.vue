<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { MediaResult } from '@/application/use-browse'
import MovieCard from '@/presentation/components/common/movie-card.vue'
import MovieCardSkeleton from '@/presentation/components/common/movie-card-skeleton.vue'

defineProps<{
  title: string
  items: MediaResult[]
  loading: boolean
}>()

const router = useRouter()

/** Number of skeleton cards to show during loading. */
const SKELETON_COUNT = 6

/**
 * Navigates to the detail page for the given item.
 */
function handleCardClick(item: MediaResult) {
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  router.push(path)
}
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white">{{ title }}</h2>

    <!-- Loading state -->
    <div
      v-if="loading"
      data-testid="popular-grid-loading"
      class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <MovieCardSkeleton v-for="n in SKELETON_COUNT" :key="n" />
    </div>

    <!-- Results grid -->
    <div
      v-else
      data-testid="popular-grid"
      class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <MovieCard
        v-for="item in items"
        :key="`${item.media_type}-${item.id}`"
        :item="item"
        @click="handleCardClick(item)"
      />
    </div>
  </section>
</template>
