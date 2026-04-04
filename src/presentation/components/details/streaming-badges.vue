<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WatchProviderRegion } from '@/domain/shared.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'

const props = defineProps<{
  providers: Record<string, WatchProviderRegion>
  region: string
}>()

const { t } = useI18n()

/** Gets the flatrate providers for the user's region. */
const regionProviders = computed(() => {
  const regionData = props.providers[props.region]
  if (!regionData) return []
  return regionData.flatrate ?? []
})

/** Returns provider logo URL. */
function getLogoUrl(logoPath: string): string | null {
  return buildImageUrl(logoPath, 'w92')
}
</script>

<template>
  <section data-testid="streaming-badges">
    <div v-if="regionProviders.length > 0" class="flex flex-wrap gap-2">
      <img
        v-for="provider in regionProviders"
        :key="provider.provider_id"
        :src="getLogoUrl(provider.logo_path)!"
        :alt="provider.provider_name"
        :title="provider.provider_name"
        class="size-10 rounded-md bg-surface md:size-12"
        data-testid="provider-logo"
      />
    </div>
    <p v-else class="text-sm text-slate-400" data-testid="not-available">
      {{ t('details.streaming.notAvailable') }}
    </p>
  </section>
</template>
