<script setup lang="ts">
import { BadgeInfo, Instagram, Twitter } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import type { PersonExternalLinkViewModel } from '@/application/use-person'

defineProps<{
  links: PersonExternalLinkViewModel[]
}>()

const { t } = useI18n()

const iconByType: Record<PersonExternalLinkViewModel['type'], Component> = {
  imdb: BadgeInfo,
  instagram: Instagram,
  twitter: Twitter,
}
</script>

<template>
  <section v-if="links.length > 0" data-testid="person-links">
    <h2 class="sr-only">{{ t('person.externalLinks') }}</h2>
    <div class="flex items-center gap-3">
      <a
        v-for="link in links"
        :key="link.type"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t(`person.external.${link.type}`)"
        class="flex size-11 items-center justify-center rounded-full bg-slate-800 text-slate-300 shadow-lg transition-colors hover:bg-slate-700 hover:text-white"
        :data-testid="`person-link-${link.type}`"
      >
        <component :is="iconByType[link.type]" class="size-5" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>
