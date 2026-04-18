<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { LibraryEntry } from '@/domain/library.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'

defineProps<{
  /** List of top-rated library entries */
  items: LibraryEntry[]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-4 rounded-xl bg-surface p-6" data-testid="top-rated-list">
    <h3 class="text-sm font-bold text-white tracking-wider">
      {{ t('stats.topRated.title') }}
    </h3>
    <div class="flex flex-col gap-3">
      <div
        v-for="(item, index) in items"
        :key="`${item.mediaType}-${item.id}`"
        class="flex items-center gap-3 rounded-lg bg-bg-secondary/50 p-2 transition-colors hover:bg-slate-700/50"
      >
        <!-- Rank and Poster -->
        <div class="relative flex-shrink-0">
          <img
            v-if="item.posterPath"
            :src="buildImageUrl(item.posterPath, 'w185')!"
            :alt="item.title"
            class="h-16 w-11 rounded object-cover shadow-sm"
            loading="lazy"
          />
          <div
            v-else
            class="flex h-16 w-11 items-center justify-center rounded bg-slate-800 text-slate-500"
          >
            <span class="text-[10px]">{{ index + 1 }}</span>
          </div>

          <!-- Rank Badge -->
          <div
            class="absolute -left-2 -top-2 flex size-6 items-center justify-center rounded-full border-2 border-surface bg-accent text-[10px] font-bold text-white shadow-lg"
          >
            {{ index + 1 }}
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-1 flex-col overflow-hidden">
          <router-link
            :to="`/${item.mediaType}/${item.id}`"
            class="truncate text-sm font-medium text-white hover:text-accent transition-colors"
          >
            {{ item.title }}
          </router-link>
          <div class="mt-1 flex items-center gap-1 text-accent">
            <Star class="size-3 fill-current" />
            <span class="text-xs font-bold">{{ item.rating.toFixed(1) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty state inside list -->
      <div v-if="items.length === 0" class="py-8 text-center text-sm text-slate-500">
        {{ t('stats.topRated.empty') }}
      </div>
    </div>
  </div>
</template>
