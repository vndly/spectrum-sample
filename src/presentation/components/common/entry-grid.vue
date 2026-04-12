<script setup lang="ts">
import { useRouter } from 'vue-router'
import MovieCard from './movie-card.vue'
import type { LibraryEntry } from '@/domain/library.schema'

defineProps<{
  entries: LibraryEntry[]
}>()

const router = useRouter()

/**
 * Navigates to the detail screen for a specific entry.
 * @param entry - The library entry
 */
function navigateToDetail(entry: LibraryEntry) {
  const path = entry.mediaType === 'movie' ? `/movie/${entry.id}` : `/show/${entry.id}`
  router.push(path)
}
</script>

<template>
  <div
    class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
  >
    <MovieCard
      v-for="entry in entries"
      :key="`${entry.mediaType}-${entry.id}`"
      :item="
        {
          id: entry.id,
          media_type: entry.mediaType,
          title: entry.title,
          name: entry.title, // For TV shows
          poster_path: entry.posterPath,
          vote_average: entry.voteAverage ?? 0,
          release_date: entry.releaseDate ?? '',
          first_air_date: entry.releaseDate ?? '', // For TV shows
        } as any
      "
      @click="navigateToDetail(entry)"
    />
  </div>
</template>
