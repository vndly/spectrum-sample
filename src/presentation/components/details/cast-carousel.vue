<script setup lang="ts">
import { computed } from 'vue'
import { User } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { CastMember } from '@/domain/shared.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = defineProps<{
  cast: CastMember[]
}>()

const { t } = useI18n()

/** Limits cast to first 20 members, sorted by order. */
const displayCast = computed(() => {
  return [...props.cast].sort((a, b) => a.order - b.order).slice(0, 20)
})

/** Returns profile image URL for a cast member. */
function getProfileUrl(profilePath: string | null): string | null {
  return buildImageUrl(profilePath, IMAGE_SIZES.profile.medium)
}
</script>

<template>
  <section v-if="cast.length > 0" data-testid="cast-carousel">
    <h2 class="mb-3 text-lg font-semibold text-white">{{ t('details.cast.title') }}</h2>
    <div class="flex gap-4 overflow-x-auto pb-2" data-testid="cast-scroll-container">
      <div
        v-for="member in displayCast"
        :key="member.id"
        class="flex shrink-0 flex-col items-center"
        data-testid="cast-member"
      >
        <!-- Profile image -->
        <div class="size-20 overflow-hidden rounded-full bg-surface md:size-24">
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
            class="flex size-full items-center justify-center text-slate-500"
            data-testid="cast-placeholder"
          >
            <User class="size-8" />
          </div>
        </div>

        <!-- Name and character -->
        <p class="mt-2 w-20 truncate text-center text-xs font-medium text-white md:w-24">
          {{ member.name }}
        </p>
        <p class="w-20 truncate text-center text-xs text-slate-400 md:w-24">
          {{ member.character }}
        </p>
      </div>
    </div>
  </section>
</template>
