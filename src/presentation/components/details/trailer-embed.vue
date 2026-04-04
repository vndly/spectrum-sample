<script setup lang="ts">
import { ref, computed } from 'vue'
import { Play } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Video } from '@/domain/shared.schema'

const props = defineProps<{
  videos: Video[]
}>()

const { t } = useI18n()

const isPlaying = ref(false)

/** Finds the official YouTube trailer. */
const trailer = computed(() => {
  return props.videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ?? null
})

/** Returns the YouTube embed URL using privacy-enhanced mode. */
const embedUrl = computed(() => {
  if (!trailer.value) return null
  return `https://www.youtube-nocookie.com/embed/${trailer.value.key}?autoplay=1`
})

/** Returns the YouTube thumbnail URL. */
const thumbnailUrl = computed(() => {
  if (!trailer.value) return null
  return `https://img.youtube.com/vi/${trailer.value.key}/hqdefault.jpg`
})

function playTrailer() {
  isPlaying.value = true
}
</script>

<template>
  <section v-if="trailer" data-testid="trailer-embed">
    <h2 class="mb-3 text-lg font-semibold text-white">{{ t('details.trailer.title') }}</h2>
    <div class="relative aspect-video w-full overflow-hidden rounded-lg bg-surface">
      <!-- Thumbnail with play button -->
      <template v-if="!isPlaying">
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          :alt="trailer.name"
          class="size-full object-cover"
          data-testid="trailer-thumbnail"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-black/40">
          <button
            class="flex size-16 items-center justify-center rounded-full bg-white/90 text-accent transition-transform hover:scale-110"
            :aria-label="t('details.trailer.play')"
            data-testid="play-button"
            @click="playTrailer"
          >
            <Play class="size-8 fill-current" />
          </button>
        </div>
      </template>

      <!-- YouTube iframe -->
      <iframe
        v-else
        :src="embedUrl!"
        class="size-full"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
        "
        allowfullscreen
        data-testid="youtube-iframe"
      />
    </div>
  </section>
</template>
