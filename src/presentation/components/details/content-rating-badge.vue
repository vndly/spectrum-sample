<script setup lang="ts">
defineProps<{
  rating: string | null
}>()
</script>

<template>
  <div
    v-if="rating"
    class="inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-slate-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
    data-testid="content-rating-badge"
  >
    {{ rating }}
  </div>
</template>
