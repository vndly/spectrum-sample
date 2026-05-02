<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { User, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { CastMember } from '@/domain/shared.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = defineProps<{
  cast: CastMember[]
}>()

const { t } = useI18n()
const carouselRef = ref<HTMLElement | null>(null)
const canScroll = ref(false)
let resizeObserver: globalThis.ResizeObserver | null = null

/** Checks if the carousel has overflow and needs scroll buttons. */
function updateCanScroll() {
  if (carouselRef.value) {
    canScroll.value = carouselRef.value.scrollWidth > carouselRef.value.clientWidth
  }
}

onMounted(() => {
  resizeObserver = new globalThis.ResizeObserver(updateCanScroll)
  if (carouselRef.value) {
    resizeObserver.observe(carouselRef.value)
  }
  updateCanScroll()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

/** Limits cast to first 20 members, sorted by order. */
const displayCast = computed(() => {
  return [...props.cast].sort((a, b) => a.order - b.order).slice(0, 20)
})

/** Returns profile image URL for a cast member. */
function getProfileUrl(profilePath: string | null): string | null {
  return buildImageUrl(profilePath, IMAGE_SIZES.profile.medium)
}

/** Scrolls the carousel in the requested direction. */
function scrollCarousel(direction: 'previous' | 'next') {
  if (!carouselRef.value) {
    return
  }

  const offset = Math.max(carouselRef.value.clientWidth * 0.75, 200)
  carouselRef.value.scrollBy({
    left: direction === 'next' ? offset : -offset,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section v-if="cast.length > 0" data-testid="cast-carousel">
    <div class="mb-3 flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold text-slate-950 dark:text-white">
        {{ t('details.cast.title') }}
      </h2>

      <div v-if="canScroll" class="flex items-center gap-2">
        <button
          data-testid="cast-scroll-previous"
          type="button"
          :aria-label="t('details.cast.scrollPrevious')"
          class="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('previous')"
        >
          <ChevronLeft class="size-4" />
        </button>
        <button
          data-testid="cast-scroll-next"
          type="button"
          :aria-label="t('details.cast.scrollNext')"
          class="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('next')"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>

    <div
      ref="carouselRef"
      class="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      data-testid="cast-scroll-container"
    >
      <RouterLink
        v-for="member in displayCast"
        :key="member.id"
        :to="`/person/${member.id}`"
        class="flex shrink-0 cursor-pointer flex-col items-center rounded-lg transition-transform duration-200 ease-in-out hover:scale-105"
        data-testid="cast-member"
      >
        <!-- Profile image -->
        <div class="size-20 overflow-hidden rounded-full bg-slate-200 dark:bg-surface md:size-24">
          <img
            v-if="getProfileUrl(member.profile_path)"
            :src="getProfileUrl(member.profile_path)!"
            :alt="member.name"
            loading="lazy"
            class="size-full object-cover"
            data-testid="cast-image"
          />
          <div
            v-else
            class="flex size-full items-center justify-center text-slate-400 dark:text-slate-500"
            data-testid="cast-placeholder"
          >
            <User class="size-8" />
          </div>
        </div>

        <!-- Name and character -->
        <p
          class="mt-2 w-20 truncate text-center text-xs font-medium text-slate-950 dark:text-white md:w-24"
        >
          {{ member.name }}
        </p>
        <p class="w-20 truncate text-center text-xs text-slate-500 dark:text-slate-400 md:w-24">
          {{ member.character }}
        </p>
      </RouterLink>
    </div>
  </section>
</template>
