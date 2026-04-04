<script setup lang="ts">
import SkeletonLoader from '@/presentation/components/common/skeleton-loader.vue'
</script>

<template>
  <div class="space-y-6" data-testid="detail-skeleton">
    <!-- Backdrop placeholder -->
    <SkeletonLoader
      width="100%"
      height="0"
      class="aspect-video"
      rounded="rounded-none"
      data-testid="backdrop-skeleton"
    />

    <div class="space-y-4 px-4 md:px-6">
      <!-- Title line placeholders -->
      <div class="space-y-2" data-testid="title-skeleton">
        <SkeletonLoader width="60%" height="2rem" />
        <SkeletonLoader width="40%" height="1rem" />
      </div>

      <!-- Rating badge placeholder -->
      <SkeletonLoader width="60px" height="28px" rounded="rounded-full" />

      <!-- Metadata line placeholders -->
      <div class="space-y-2" data-testid="metadata-skeleton">
        <SkeletonLoader width="80%" height="1rem" />
        <SkeletonLoader width="50%" height="1rem" />
        <SkeletonLoader width="60%" height="1rem" />
      </div>

      <!-- Synopsis placeholder -->
      <div class="space-y-2">
        <SkeletonLoader width="100%" height="1rem" />
        <SkeletonLoader width="100%" height="1rem" />
        <SkeletonLoader width="70%" height="1rem" />
      </div>

      <!-- Action buttons placeholder -->
      <div class="flex gap-2" data-testid="actions-skeleton">
        <SkeletonLoader v-for="i in 5" :key="i" width="44px" height="44px" rounded="rounded-lg" />
      </div>

      <!-- Cast circle placeholders -->
      <div class="flex gap-4 overflow-hidden" data-testid="cast-skeleton">
        <div v-for="i in 6" :key="i" class="flex shrink-0 flex-col items-center gap-2">
          <SkeletonLoader width="80px" height="80px" rounded="rounded-full" />
          <SkeletonLoader width="60px" height="0.75rem" />
          <SkeletonLoader width="50px" height="0.75rem" />
        </div>
      </div>
    </div>
  </div>
</template>
