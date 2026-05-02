<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import PersonLinks from '@/presentation/components/details/person-links.vue'
import type { PersonExternalLinkViewModel } from '@/application/use-person'

defineProps<{
  name: string
  knownForDepartment: string
  profileUrl: string | null
  birthInfo: string | null
  deathInfo: string | null
  links: PersonExternalLinkViewModel[]
}>()

const { t } = useI18n()
</script>

<template>
  <section class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
    <div
      class="size-40 shrink-0 overflow-hidden rounded-full bg-slate-800 shadow-2xl ring-1 ring-white/10 md:size-[200px]"
    >
      <img
        v-if="profileUrl"
        :src="profileUrl"
        :alt="t('person.profileAlt', { name })"
        class="size-40 object-cover md:size-[200px]"
        data-testid="person-profile-image"
      />
      <div
        v-else
        class="flex size-full items-center justify-center text-slate-500"
        data-testid="person-profile-placeholder"
      >
        <User class="size-16" aria-hidden="true" />
      </div>
    </div>

    <div class="pt-1 text-center md:text-left">
      <h1 class="text-2xl font-bold text-white">{{ name }}</h1>
      <p class="mt-2 text-sm text-slate-400">{{ knownForDepartment }}</p>

      <div v-if="birthInfo || deathInfo || links.length > 0" class="mt-5 space-y-5">
        <dl
          v-if="birthInfo || deathInfo"
          class="space-y-3 text-sm text-slate-300"
          data-testid="person-hero-info"
        >
          <div v-if="birthInfo">
            <dt class="text-xs text-slate-500">{{ t('person.born') }}</dt>
            <dd class="mt-1">{{ birthInfo }}</dd>
          </div>
          <div v-if="deathInfo">
            <dt class="text-xs text-slate-500">{{ t('person.died') }}</dt>
            <dd class="mt-1">{{ deathInfo }}</dd>
          </div>
        </dl>

        <PersonLinks :links="links" />
      </div>
    </div>
  </section>
</template>
