<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Facebook, Instagram, Twitter, Film } from 'lucide-vue-next'

const props = defineProps<{
  imdbId?: string | null
  homepage?: string | null
  facebookId?: string | null
  instagramId?: string | null
  twitterId?: string | null
}>()

const { t } = useI18n()

/** Builds the full IMDb URL from the ID. */
const imdbUrl = computed(() => (props.imdbId ? `https://www.imdb.com/title/${props.imdbId}` : null))

/** Builds the full Facebook URL from the ID. */
const facebookUrl = computed(() =>
  props.facebookId ? `https://www.facebook.com/${props.facebookId}` : null,
)

/** Builds the full Instagram URL from the ID. */
const instagramUrl = computed(() =>
  props.instagramId ? `https://www.instagram.com/${props.instagramId}` : null,
)

/** Builds the full Twitter/X URL from the ID. */
const twitterUrl = computed(() =>
  props.twitterId ? `https://twitter.com/${props.twitterId}` : null,
)

/** Whether any link is available. */
const hasLinks = computed(
  () =>
    imdbUrl.value || props.homepage || facebookUrl.value || instagramUrl.value || twitterUrl.value,
)
</script>

<template>
  <section v-if="hasLinks" data-testid="external-links">
    <h2
      class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      {{ t('details.links.title') }}
    </h2>

    <div class="flex items-center gap-2">
      <!-- IMDb -->
      <a
        v-if="imdbUrl"
        :href="imdbUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t('details.actions.imdb')"
        class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:border-amber-500/50 hover:bg-amber-50 hover:text-amber-600 dark:border-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:border-amber-500/50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
        data-testid="link-imdb"
      >
        <Film class="size-5" />
      </a>

      <!-- Homepage -->
      <a
        v-if="homepage"
        :href="homepage"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t('details.links.homepage')"
        class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:border-teal-500/50 hover:bg-teal-50 hover:text-teal-600 dark:border-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:border-teal-500/50 dark:hover:bg-teal-500/10 dark:hover:text-teal-400"
        data-testid="link-homepage"
      >
        <Globe class="size-5" />
      </a>

      <!-- Facebook -->
      <a
        v-if="facebookUrl"
        :href="facebookUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:border-blue-500/50 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
        data-testid="link-facebook"
      >
        <Facebook class="size-5" />
      </a>

      <!-- Instagram -->
      <a
        v-if="instagramUrl"
        :href="instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:border-pink-500/50 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:border-pink-500/50 dark:hover:bg-pink-500/10 dark:hover:text-pink-400"
        data-testid="link-instagram"
      >
        <Instagram class="size-5" />
      </a>

      <!-- Twitter/X -->
      <a
        v-if="twitterUrl"
        :href="twitterUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
        class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors duration-200 hover:border-sky-500/50 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-surface dark:text-slate-400 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
        data-testid="link-twitter"
      >
        <Twitter class="size-5" />
      </a>
    </div>
  </section>
</template>
