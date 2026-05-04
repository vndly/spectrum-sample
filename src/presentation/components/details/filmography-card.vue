<script setup lang="ts">
import { computed } from 'vue'
import { Film, Star } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { PersonCreditViewModel } from '@/application/use-person'

const props = defineProps<{
  credit: PersonCreditViewModel
}>()

const { t } = useI18n()

const displayRating = computed(() => {
  if (!props.credit.voteAverage || props.credit.voteAverage <= 0) return null
  return props.credit.voteAverage.toFixed(1)
})
</script>

<template>
  <RouterLink
    :to="credit.route"
    class="group block min-h-11 transition-transform duration-200 ease-in-out hover:scale-105"
  >
    <div class="relative overflow-hidden rounded-lg shadow-lg">
      <div class="aspect-[2/3] bg-slate-200 dark:bg-surface">
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
      <div
        v-if="displayRating"
        class="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white"
      >
        <Star class="size-3 fill-current" aria-hidden="true" />
        <span>{{ displayRating }}</span>
      </div>
    </div>

    <div class="mt-2 space-y-0.5">
      <h3 class="truncate text-sm font-medium text-slate-950 dark:text-white">
        {{ credit.title }}
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {{ t(`person.media.${credit.mediaType}`) }}
        <template v-if="credit.releaseYear">
          <span class="mx-1">·</span>
          {{ credit.releaseYear }}
        </template>
        <template v-else>
          <span class="mx-1">·</span>
          {{ t('person.tba') }}
        </template>
      </p>
      <p v-if="credit.character" class="truncate text-xs text-slate-500 dark:text-slate-400">
        {{ credit.character }}
      </p>
    </div>
  </RouterLink>
</template>
