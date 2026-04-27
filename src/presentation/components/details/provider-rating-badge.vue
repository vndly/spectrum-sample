<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  voteAverage: number
}>()

/** Formats the vote average to one decimal place. */
const formattedRating = computed(() => props.voteAverage.toFixed(1))
</script>

<template>
  <div
    v-if="voteAverage > 0"
    class="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-sm font-bold text-white"
    data-testid="provider-rating-badge"
  >
    <Star class="size-4 fill-current" aria-hidden="true" data-testid="star-icon" />
    <span data-testid="rating-value">{{ formattedRating }}</span>
  </div>
</template>
