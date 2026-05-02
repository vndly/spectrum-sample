<script setup lang="ts">
import { Film } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { PersonCreditViewModel } from '@/application/use-person'

defineProps<{
  credit: PersonCreditViewModel
}>()

const { t } = useI18n()
</script>

<template>
  <RouterLink
    :to="credit.route"
    class="group block min-h-11 transition-transform duration-200 ease-in-out hover:scale-105"
  >
    <div class="overflow-hidden rounded-lg bg-slate-800 shadow-lg">
      <div class="aspect-[2/3] bg-slate-900">
        <img
          v-if="credit.posterUrl"
          :src="credit.posterUrl"
          :alt="t('person.posterAlt', { title: credit.title })"
          loading="lazy"
          class="size-full object-cover"
        />
        <div
          v-else
          class="flex size-full items-center justify-center text-slate-500"
          data-testid="filmography-poster-placeholder"
        >
          <Film class="size-10" aria-hidden="true" />
        </div>
      </div>
    </div>

    <div class="mt-2 space-y-1">
      <div class="flex items-center gap-2">
        <span
          class="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          :class="credit.mediaType === 'movie' ? 'bg-teal-600' : 'bg-violet-600'"
        >
          {{ t(`person.media.${credit.mediaType}`) }}
        </span>
        <span class="text-xs text-slate-400">{{ credit.releaseYear ?? t('person.tba') }}</span>
      </div>
      <h3 class="truncate text-sm font-medium text-white">{{ credit.title }}</h3>
      <p v-if="credit.character" class="truncate text-xs text-slate-400">
        {{ credit.character }}
      </p>
    </div>
  </RouterLink>
</template>
