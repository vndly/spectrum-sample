<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRecommendations } from '@/application/use-recommendations'
import RecommendationCarousel from '@/presentation/components/recommendations/RecommendationCarousel.vue'

const { t } = useI18n()
const { sections, loading, fetchSection } = useRecommendations()

function handleIntersect(index: number) {
  fetchSection(index)
}
</script>

<template>
  <div class="space-y-8 pb-12">
    <header class="space-y-2">
      <h2 class="text-2xl font-bold text-white">
        {{ t('recommendations.title') }}
      </h2>
    </header>

    <div v-if="loading" class="space-y-10">
      <div v-for="n in 3" :key="n" class="space-y-4">
        <div class="h-6 w-48 animate-pulse rounded bg-surface"></div>
        <div class="flex gap-4 overflow-hidden">
          <div
            v-for="i in 6"
            :key="i"
            class="aspect-[2/3] w-32 md:w-40 flex-shrink-0 animate-pulse rounded-lg bg-surface"
          ></div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-10">
      <RecommendationCarousel
        v-for="(section, index) in sections"
        :key="section.seed ? `seed-${section.seed.id}` : section.titleKey"
        :title-key="section.titleKey!"
        :title-params="section.titleParams"
        :items="section.results"
        :loading="section.loading"
        :error="section.error"
        :fetched="section.fetched"
        @intersect="handleIntersect(index)"
      />
    </div>
  </div>
</template>
