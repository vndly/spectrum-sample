<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    icon?: Component
    title: string
    description?: string
    ctaLabel?: string
    ctaAction?: () => void
  }>(),
  {
    icon: undefined,
    description: undefined,
    ctaLabel: undefined,
    ctaAction: undefined,
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div v-if="icon" aria-hidden="true" data-testid="empty-state-icon" class="text-slate-400">
      <component :is="icon" class="size-12" />
    </div>
    <h2 class="text-lg font-bold text-white">{{ title }}</h2>
    <p v-if="description" data-testid="empty-state-description" class="max-w-sm text-slate-400">
      {{ description }}
    </p>
    <button
      v-if="ctaLabel && ctaAction"
      class="mt-2 cursor-pointer rounded-md bg-accent px-4 py-2 text-white transition-colors hover:bg-accent/80"
      @click="ctaAction"
    >
      {{ ctaLabel }}
    </button>
    <slot />
  </div>
</template>
