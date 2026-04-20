<script setup lang="ts">
import { Heart, Bookmark, Eye, Share2, ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { WatchStatus } from '@/domain/library.schema'

const props = defineProps<{
  favorite: boolean
  status: WatchStatus
  imdbId: string | null
  shareUrl: string
  shareTitle: string
}>()

const emit = defineEmits<{
  'toggle-favorite': []
  'update-status': [status: WatchStatus]
  share: []
}>()

const { t } = useI18n()

/** Handles status button click - toggles off if already active. */
function handleStatusClick(newStatus: WatchStatus) {
  if (props.status === newStatus) {
    emit('update-status', 'none')
  } else {
    emit('update-status', newStatus)
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2" data-testid="action-buttons">
    <!-- Favorite button -->
    <button
      type="button"
      class="flex size-11 items-center justify-center rounded-lg transition-colors"
      :class="favorite ? 'bg-accent text-white' : 'bg-surface text-slate-400 hover:text-white'"
      :aria-label="favorite ? t('details.actions.unfavorite') : t('details.actions.favorite')"
      :title="favorite ? t('details.actions.unfavorite') : t('details.actions.favorite')"
      data-testid="favorite-button"
      @click="emit('toggle-favorite')"
    >
      <Heart class="size-5" :class="favorite ? 'fill-current' : ''" />
    </button>

    <!-- Watchlist button -->
    <button
      type="button"
      class="flex size-11 items-center justify-center rounded-lg transition-colors"
      :class="
        status === 'watchlist'
          ? 'bg-accent text-white'
          : 'bg-surface text-slate-400 hover:text-white'
      "
      :aria-label="t('details.actions.watchlist')"
      :title="t('details.actions.watchlist')"
      data-testid="watchlist-button"
      @click="handleStatusClick('watchlist')"
    >
      <Bookmark class="size-5" :class="status === 'watchlist' ? 'fill-current' : ''" />
    </button>

    <!-- Watched button -->
    <button
      type="button"
      class="flex size-11 items-center justify-center rounded-lg transition-colors"
      :class="
        status === 'watched' ? 'bg-accent text-white' : 'bg-surface text-slate-400 hover:text-white'
      "
      :aria-label="t('details.actions.watched')"
      :title="t('details.actions.watched')"
      data-testid="watched-button"
      @click="handleStatusClick('watched')"
    >
      <Eye class="size-5" :class="status === 'watched' ? 'fill-current' : ''" />
    </button>

    <!-- Share button -->
    <button
      type="button"
      class="flex size-11 items-center justify-center rounded-lg bg-surface text-slate-400 transition-colors hover:text-white"
      aria-label="Share"
      :title="t('details.actions.share')"
      data-testid="share-button"
      @click="emit('share')"
    >
      <Share2 class="size-5" />
    </button>

    <!-- IMDB link -->
    <a
      v-if="imdbId"
      :href="`https://www.imdb.com/title/${imdbId}`"
      target="_blank"
      rel="noopener noreferrer"
      class="flex size-11 items-center justify-center rounded-lg bg-surface text-slate-400 transition-colors hover:text-white"
      :aria-label="t('details.actions.imdb')"
      :title="t('details.actions.imdb')"
      data-testid="imdb-link"
    >
      <ExternalLink class="size-5" />
    </a>
  </div>
</template>
