<script setup lang="ts">
import { computed } from 'vue'
import { Film, Star } from 'lucide-vue-next'
import type { MovieListItem } from '@/domain/movie.schema'
import type { ShowListItem } from '@/domain/show.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = withDefaults(
  defineProps<{
    item: (MovieListItem | ShowListItem) & { media_type?: 'movie' | 'tv' | 'person' }
    variant?: 'grid' | 'list'
  }>(),
  {
    variant: 'grid',
  },
)

const emit = defineEmits<{
  click: []
}>()

/** Returns the title for movies or name for TV shows. */
const displayTitle = computed(() => {
  if (props.item.media_type === 'person' && 'name' in props.item) {
    return props.item.name
  }
  if ('title' in props.item) {
    return props.item.title
  }
  if ('name' in props.item) {
    return props.item.name
  }
  return ''
})

/** Returns the release year from release_date or first_air_date. */
const displayYear = computed(() => {
  if (props.item.media_type === 'person') return ''
  const date = 'release_date' in props.item ? props.item.release_date : props.item.first_air_date
  if (!date) {
    return ''
  }
  return date.substring(0, 4)
})

/** Returns the formatted vote average (one decimal place). */
const displayRating = computed(() => {
  return props.item.vote_average?.toFixed(1) || '0.0'
})

/** Returns the poster URL or null if no poster available. */
const posterUrl = computed(() => {
  return buildImageUrl(props.item.poster_path, IMAGE_SIZES.poster.small)
})

/** Returns the media type label. */
const mediaTypeLabel = computed(() => {
  if (props.item.media_type === 'movie') return 'Movie'
  if (props.item.media_type === 'tv') return 'TV Show'
  return ''
})

/**
 * Handles click event on the card.
 */
function handleClick() {
  emit('click')
}

/**
 * Handles keyboard navigation for accessibility.
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}
</script>

<template>
  <article
    class="group cursor-pointer transition-all duration-200"
    :class="[variant === 'grid' ? 'hover:scale-105' : 'hover:bg-surface-hover rounded-lg p-2']"
    role="button"
    tabindex="0"
    :aria-label="displayTitle"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Grid Layout -->
    <template v-if="variant === 'grid'">
      <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
        <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="displayTitle"
          loading="lazy"
          class="size-full object-cover"
        />
        <div v-else class="flex size-full items-center justify-center text-slate-500">
          <Film class="size-12" />
        </div>
        <div
          v-if="item.vote_average > 0"
          class="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white"
        >
          <Star class="size-3 fill-current" aria-hidden="true" />
          <span>{{ displayRating }}</span>
        </div>
      </div>
      <div class="mt-2">
        <h3 class="truncate text-sm font-medium text-white">{{ displayTitle }}</h3>
        <p v-if="displayYear" class="text-xs text-slate-400">{{ displayYear }}</p>
      </div>
    </template>

    <!-- List Layout -->
    <template v-else>
      <div class="flex items-center gap-4">
        <div class="relative size-12 flex-shrink-0 overflow-hidden rounded bg-surface">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="displayTitle"
            loading="lazy"
            class="size-full object-cover"
          />
          <div v-else class="flex size-full items-center justify-center text-slate-500">
            <Film class="size-6" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-base font-medium text-white">{{ displayTitle }}</h3>
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span>{{ mediaTypeLabel }}</span>
            <span v-if="displayYear">• {{ displayYear }}</span>
            <span
              v-if="item.vote_average > 0"
              class="flex items-center gap-0.5 text-accent font-bold"
            >
              <Star class="size-3 fill-current" />
              {{ displayRating }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </article>
</template>
