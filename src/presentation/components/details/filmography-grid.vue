<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FilmographyCard from './filmography-card.vue'
import type { PersonCreditViewModel } from '@/application/use-person'

defineProps<{
  credits: PersonCreditViewModel[]
}>()

const { t } = useI18n()
</script>

<template>
  <section data-testid="filmography-section">
    <h2 class="text-lg font-bold text-white">
      {{ t('person.filmographyCount', { count: credits.length }) }}
    </h2>

    <div
      v-if="credits.length > 0"
      class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      data-testid="filmography-grid"
    >
      <FilmographyCard
        v-for="credit in credits"
        :key="`${credit.mediaType}-${credit.id}`"
        :credit="credit"
      />
    </div>

    <p v-else class="py-10 text-center text-sm text-slate-400">{{ t('person.creditsEmpty') }}</p>
  </section>
</template>
