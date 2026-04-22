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
  <div class="relative aspect-video w-full overflow-hidden">
    <!-- Backdrop image -->
    <img
      v-if="backdropUrl"
      :src="backdropUrl"
      :srcset="backdropSrcSet || undefined"
      sizes="100vw"
      :alt="`Backdrop for ${title}`"
      class="size-full object-cover"
      data-testid="backdrop-image"
    />
    <!-- Solid gradient fallback when no image -->
    <div
      v-else
      class="size-full bg-gradient-to-b from-surface to-background"
      data-testid="backdrop-fallback"
    />

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
      data-testid="gradient-overlay"
    />

    <!-- Title and tagline -->
    <div class="absolute inset-x-0 bottom-0 p-4 md:p-6">
      <h1 class="text-2xl font-bold text-white md:text-4xl" data-testid="title">
        {{ title }}
      </h1>
      <p v-if="tagline" class="mt-1 text-sm text-slate-400 md:text-base" data-testid="tagline">
        {{ tagline }}
      </p>
    </div>
  </div>
</template>
