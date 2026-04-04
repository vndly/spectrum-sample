<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  overview: string | null
}>()

/** Whether to show the synopsis. */
const shouldShow = computed(() => props.overview && props.overview.trim().length > 0)
</script>

<template>
  <section v-if="shouldShow" data-testid="synopsis">
    <p class="text-sm leading-relaxed text-slate-300 md:text-base">{{ overview }}</p>
  </section>
</template>
