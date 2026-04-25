<script setup lang="ts">
import { computed } from 'vue'
import { buildImageSrcSet, buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = defineProps<{
  backdropPath: string | null
  title: string
  tagline?: string | null
}>()

/** Returns the backdrop image URL or null if no backdrop. */
const backdropUrl = computed(() => {
  return buildImageUrl(props.backdropPath, IMAGE_SIZES.backdrop.large)
})

/** Returns responsive backdrop candidates for high-density displays. */
const backdropSrcSet = computed(() => {
  return buildImageSrcSet(props.backdropPath, [
    IMAGE_SIZES.backdrop.medium,
    IMAGE_SIZES.backdrop.large,
  ])
})
</script>

<template>
  <div>
    <!-- Backdrop image - cinematic letterbox aspect ratio -->
    <div class="relative aspect-[3/1] w-full overflow-hidden">
      <img
        v-if="backdropUrl"
        :src="backdropUrl"
        :srcset="backdropSrcSet || undefined"
        sizes="100vw"
        :alt="`Backdrop for ${title}`"
        class="size-full object-cover object-center"
        data-testid="backdrop-image"
      />
      <!-- Solid gradient fallback when no image -->
      <div
        v-else
        class="size-full bg-gradient-to-b from-surface to-background"
        data-testid="backdrop-fallback"
      />

      <!-- Gradient overlay - fade to background at bottom -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"
        data-testid="gradient-overlay"
      />
    </div>

    <!-- Title row with action buttons slot -->
    <div class="flex items-start justify-between gap-4 px-4 pt-4 md:px-6 md:pt-6">
      <div class="min-w-0 flex-1">
        <h1
          class="text-2xl font-bold tracking-tight text-slate-950 dark:text-white md:text-3xl"
          data-testid="title"
        >
          {{ title }}
        </h1>
        <p
          v-if="tagline"
          class="mt-1 text-sm italic text-slate-500 dark:text-slate-400 md:text-base"
          data-testid="tagline"
        >
          {{ tagline }}
        </p>
      </div>
      <!-- Slot for action buttons -->
      <slot name="actions" />
    </div>
  </div>
</template>
