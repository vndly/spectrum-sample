import { ref, toValue, watch } from 'vue'
import type { MaybeRef, Ref } from 'vue'
import { IMAGE_SIZES } from '@/domain/constants'
import type { PersonCredit } from '@/domain/person.schema'
import {
  buildExternalUrl,
  deduplicateCredits,
  hasExternalLinks,
  normalizePersonDates,
  sortCreditsByDate,
} from '@/domain/person.logic'
import { getPersonDetail } from '@/infrastructure/provider.client'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { useSettings } from '@/application/use-settings'

/** View model for a supported person external link. */
export type PersonExternalLinkViewModel = {
  type: 'imdb' | 'instagram' | 'twitter'
  url: string
}

/** View model for a person filmography credit rendered by Presentation. */
export type PersonCreditViewModel = {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  character: string | null
  releaseYear: string | null
  posterUrl: string | null
  route: string
}

/** View model for the person detail page rendered by Presentation. */
export type PersonPageData = {
  id: number
  name: string
  knownForDepartment: string
  biography: string | null
  profileUrl: string | null
  birthInfo: string | null
  deathInfo: string | null
  externalLinks: PersonExternalLinkViewModel[]
  filmography: PersonCreditViewModel[]
}

function creditTitle(credit: PersonCredit): string {
  return credit.media_type === 'movie' ? credit.title : credit.name
}

function creditDate(credit: PersonCredit): string | null {
  return credit.media_type === 'movie' ? credit.release_date : credit.first_air_date
}

function formatDate(date: string | null, language: string): string | null {
  if (!date) {
    return null
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

function buildBirthInfo(
  birthday: string | null,
  placeOfBirth: string | null,
  language: string,
): string | null {
  const formattedBirthday = formatDate(birthday, language)

  if (formattedBirthday && placeOfBirth) {
    return `${formattedBirthday} - ${placeOfBirth}`
  }

  return formattedBirthday ?? placeOfBirth
}

function buildExternalLinks(
  externalIds: Parameters<typeof hasExternalLinks>[0],
): PersonExternalLinkViewModel[] {
  if (!hasExternalLinks(externalIds)) {
    return []
  }

  const links: PersonExternalLinkViewModel[] = []

  if (externalIds.imdb_id) {
    links.push({ type: 'imdb', url: buildExternalUrl('imdb', externalIds.imdb_id) })
  }
  if (externalIds.instagram_id) {
    links.push({
      type: 'instagram',
      url: buildExternalUrl('instagram', externalIds.instagram_id),
    })
  }
  if (externalIds.twitter_id) {
    links.push({ type: 'twitter', url: buildExternalUrl('twitter', externalIds.twitter_id) })
  }

  return links
}

function toCreditViewModel(credit: PersonCredit): PersonCreditViewModel {
  const date = creditDate(credit)

  return {
    id: credit.id,
    mediaType: credit.media_type,
    title: creditTitle(credit),
    character: credit.character,
    releaseYear: date ? date.substring(0, 4) : null,
    posterUrl: buildImageUrl(credit.poster_path, IMAGE_SIZES.poster.small),
    route: credit.media_type === 'movie' ? `/movie/${credit.id}` : `/show/${credit.id}`,
  }
}

/**
 * Fetches and prepares person detail page data for Presentation.
 * @param id - The TMDB person ID as either a ref or plain number
 * @returns Reactive person page data, loading state, error state, and refresh function
 */
export function usePerson(id: MaybeRef<number>): {
  data: Ref<PersonPageData | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refresh: () => void
} {
  const { language } = useSettings()

  const data: Ref<PersonPageData | null> = ref(null)
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)
  let requestId = 0

  async function fetchData(personId: number, activeLanguage: string) {
    const currentRequestId = ++requestId
    loading.value = true
    error.value = null

    try {
      const person = await getPersonDetail(personId, activeLanguage)
      if (currentRequestId !== requestId) {
        return
      }

      const dateInfo = normalizePersonDates(person.birthday, person.deathday, person.place_of_birth)
      const filmography = sortCreditsByDate(deduplicateCredits(person.combined_credits.cast)).map(
        toCreditViewModel,
      )

      data.value = {
        id: person.id,
        name: person.name,
        knownForDepartment: person.known_for_department,
        biography: person.biography.trim() || null,
        profileUrl: buildImageUrl(person.profile_path, IMAGE_SIZES.profile.medium),
        birthInfo: buildBirthInfo(dateInfo.birthday, dateInfo.placeOfBirth, activeLanguage),
        deathInfo: formatDate(dateInfo.deathday, activeLanguage),
        externalLinks: buildExternalLinks(person.external_ids),
        filmography,
      }
    } catch (e) {
      if (currentRequestId !== requestId) {
        return
      }

      error.value = e instanceof Error ? e : new Error('Failed to fetch person details')
      data.value = null
    } finally {
      if (currentRequestId === requestId) {
        loading.value = false
      }
    }
  }

  function refresh() {
    fetchData(toValue(id), language.value)
  }

  watch(
    [() => toValue(id), language],
    ([personId, activeLanguage]) => {
      fetchData(personId, activeLanguage)
    },
    { immediate: true },
  )

  return {
    data,
    loading,
    error,
    refresh,
  }
}
