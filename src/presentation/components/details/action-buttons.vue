<script setup lang="ts">
import { Bookmark, Eye, Share2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { WatchStatus } from '@/domain/library.schema'

const props = defineProps<{
  status: WatchStatus
  shareUrl: string
  shareTitle: string
}>()

const emit = defineEmits<{
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
    <!-- Watchlist button -->
    <button
      type="button"
      class="flex size-11 items-center justify-center rounded-lg transition-colors"
      :class="
        status === 'watchlist'
          ? 'bg-accent text-white'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:text-white'
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
        status === 'watched'
          ? 'bg-accent text-white'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:text-white'
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
      class="flex size-11 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:text-white"
      aria-label="Share"
      :title="t('details.actions.share')"
      data-testid="share-button"
      @click="emit('share')"
    >
      <Share2 class="size-5" />
    </button>
  </div>
</template>
