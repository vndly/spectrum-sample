<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Image } from '@/domain/shared.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = defineProps<{
  posters: Image[]
  backdrops: Image[]
}>()

const { t } = useI18n()

type TabType = 'posters' | 'backdrops'
const activeTab = ref<TabType>('backdrops')
const carouselRef = ref<HTMLElement | null>(null)
const canScroll = ref(false)
let resizeObserver: globalThis.ResizeObserver | null = null

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

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

// Update canScroll when tab changes and reset lightbox index to prevent out-of-bounds
watch(activeTab, async () => {
  if (lightboxOpen.value) {
    lightboxIndex.value = 0
  }
  await nextTick()
  updateCanScroll()
})

/** Limited posters for display (first 10). */
const displayPosters = computed(() => props.posters.slice(0, 10))

/** Limited backdrops for display (first 10). */
const displayBackdrops = computed(() => props.backdrops.slice(0, 10))

/** Current images based on active tab. */
const currentImages = computed(() =>
  activeTab.value === 'posters' ? displayPosters.value : displayBackdrops.value,
)

/** Whether there are any images to display. */
const hasImages = computed(() => props.posters.length > 0 || props.backdrops.length > 0)

/** Sets the default tab based on available images. */
onMounted(() => {
  if (props.backdrops.length === 0 && props.posters.length > 0) {
    activeTab.value = 'posters'
  }
})

/** Returns thumbnail URL for an image. */
function getThumbnailUrl(image: Image, type: TabType): string | null {
  const size = type === 'posters' ? IMAGE_SIZES.poster.small : IMAGE_SIZES.backdrop.small
  return buildImageUrl(image.file_path, size)
}

/** Returns full-size URL for an image in lightbox. */
function getFullUrl(image: Image, type: TabType): string | null {
  const size = type === 'posters' ? IMAGE_SIZES.poster.large : IMAGE_SIZES.backdrop.large
  return buildImageUrl(image.file_path, size)
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

/** Opens lightbox at the specified index. */
function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

/** Closes the lightbox. */
function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

/** Navigates to the previous image in lightbox. */
function lightboxPrevious() {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--
  } else {
    lightboxIndex.value = currentImages.value.length - 1
  }
}

/** Navigates to the next image in lightbox. */
function lightboxNext() {
  if (lightboxIndex.value < currentImages.value.length - 1) {
    lightboxIndex.value++
  } else {
    lightboxIndex.value = 0
  }
}

/** Handles keyboard navigation in lightbox. */
function handleKeydown(event: KeyboardEvent) {
  if (!lightboxOpen.value) return

  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      lightboxPrevious()
      break
    case 'ArrowRight':
      lightboxNext()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section v-if="hasImages" data-testid="images-gallery">
    <!-- Header with title, tabs, and scroll buttons -->
    <div class="mb-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-semibold text-slate-950 dark:text-white">
          {{ t('details.images.title') }}
        </h2>

        <!-- Tab switcher -->
        <div class="flex rounded-lg bg-slate-100 p-0.5 dark:bg-surface">
          <button
            v-if="backdrops.length > 0"
            type="button"
            :class="[
              'rounded-md px-3 py-1 text-xs font-medium transition-colors duration-200',
              activeTab === 'backdrops'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            ]"
            data-testid="tab-backdrops"
            @click="activeTab = 'backdrops'"
          >
            {{ t('details.images.backdrops') }}
          </button>
          <button
            v-if="posters.length > 0"
            type="button"
            :class="[
              'rounded-md px-3 py-1 text-xs font-medium transition-colors duration-200',
              activeTab === 'posters'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            ]"
            data-testid="tab-posters"
            @click="activeTab = 'posters'"
          >
            {{ t('details.images.posters') }}
          </button>
        </div>
      </div>

      <!-- Scroll buttons -->
      <div v-if="canScroll" class="flex items-center gap-2">
        <button
          data-testid="images-scroll-previous"
          type="button"
          aria-label="Scroll images left"
          class="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('previous')"
        >
          <ChevronLeft class="size-4" />
        </button>
        <button
          data-testid="images-scroll-next"
          type="button"
          aria-label="Scroll images right"
          class="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('next')"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>

    <!-- Scrollable thumbnails -->
    <div
      ref="carouselRef"
      class="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      data-testid="images-scroll-container"
    >
      <button
        v-for="(image, index) in currentImages"
        :key="image.file_path"
        type="button"
        class="group shrink-0 overflow-hidden rounded-lg bg-slate-200 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-surface dark:focus:ring-offset-slate-900"
        :class="activeTab === 'posters' ? 'h-32 w-[86px]' : 'h-24 w-40'"
        data-testid="image-thumbnail"
        @click="openLightbox(index)"
      >
        <img
          :src="getThumbnailUrl(image, activeTab)!"
          :alt="`Image ${index + 1}`"
          loading="lazy"
          class="size-full object-cover transition-opacity duration-200 group-hover:opacity-90"
        />
      </button>
    </div>

    <!-- Lightbox modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          data-testid="lightbox"
          @click.self="closeLightbox"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            aria-label="Close"
            data-testid="lightbox-close"
            @click="closeLightbox"
          >
            <X class="size-6" />
          </button>

          <!-- Previous button -->
          <button
            v-if="currentImages.length > 1"
            type="button"
            class="absolute left-4 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            aria-label="Previous image"
            data-testid="lightbox-previous"
            @click="lightboxPrevious"
          >
            <ChevronLeft class="size-6" />
          </button>

          <!-- Image -->
          <img
            :src="getFullUrl(currentImages[lightboxIndex], activeTab)!"
            :alt="`Image ${lightboxIndex + 1}`"
            :class="
              activeTab === 'posters' ? 'max-h-[85vh] max-w-[90vw]' : 'max-h-[80vh] max-w-[95vw]'
            "
            class="rounded-lg object-contain"
            data-testid="lightbox-image"
          />

          <!-- Next button -->
          <button
            v-if="currentImages.length > 1"
            type="button"
            class="absolute right-4 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            aria-label="Next image"
            data-testid="lightbox-next"
            @click="lightboxNext"
          >
            <ChevronRight class="size-6" />
          </button>

          <!-- Image counter -->
          <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
          >
            {{ lightboxIndex + 1 }} / {{ currentImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
