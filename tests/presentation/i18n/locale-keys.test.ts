import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const LOCALES_DIR = resolve(process.cwd(), 'src/presentation/i18n/locales')
const LOCALE_FILES = ['en.json', 'es.json', 'fr.json'] as const

const EXPECTED_KEYS = [
  'app.title',
  'calendar.empty.description',
  'calendar.empty.title',
  'calendar.nav.next',
  'calendar.nav.previous',
  'calendar.nav.today',
  'common.empty.description',
  'common.empty.title',
  'common.error.description',
  'common.error.reload',
  'common.error.title',
  'common.retry',
  'errors.generic',
  'details.actions.favorite',
  'details.actions.imdb',
  'details.actions.share',
  'details.actions.unfavorite',
  'details.actions.watched',
  'details.actions.watchlist',
  'details.boxOffice.budget',
  'details.boxOffice.revenue',
  'details.boxOffice.title',
  'details.cast.scrollNext',
  'details.cast.scrollPrevious',
  'details.cast.title',
  'details.error.retry',
  'details.error.title',
  'details.loading',
  'details.metadata.director',
  'details.metadata.directors',
  'details.metadata.episodes',
  'details.metadata.language',
  'details.metadata.seasons',
  'details.metadata.writer',
  'details.metadata.writers',
  'details.synopsis.title',
  'details.notFound.home',
  'details.notFound.message',
  'details.notFound.title',
  'details.share.copied',
  'details.streaming.title',
  'details.streaming.notAvailable',
  'details.trailer.play',
  'details.trailer.title',
  'details.links.title',
  'details.links.homepage',
  'details.images.title',
  'details.images.posters',
  'details.images.backdrops',
  'home.browse.error.message',
  'home.browse.error.retry',
  'home.browse.popularMovies',
  'home.browse.popularShows',
  'home.browse.scrollNext',
  'home.browse.scrollPrevious',
  'home.browse.trending',
  'home.filters.clear',
  'home.filters.genre',
  'home.filters.genreClear',
  'home.filters.genreSearch',
  'home.filters.grid',
  'home.filters.list',
  'home.filters.mediaType.all',
  'home.filters.mediaType.movie',
  'home.filters.mediaType.tv',
  'home.filters.year.decrement',
  'home.filters.year.increment',
  'home.filters.yearFrom',
  'home.filters.yearTo',
  'home.search.clear',
  'home.search.empty.subtitle',
  'home.search.empty.title',
  'home.search.error.message',
  'home.search.error.retry',
  'home.search.placeholder',
  'home.sections.popular',
  'home.sections.search',
  'home.sections.trending',
  'library.empty.filtered.description',
  'library.empty.filtered.title',
  'library.empty.watched.description',
  'library.empty.watched.title',
  'library.empty.watchlist.description',
  'library.empty.watchlist.title',
  'library.filters.rating',
  'library.filters.ratingMax',
  'library.filters.ratingMin',
  'library.sort.dateAdded',
  'library.sort.label',
  'library.sort.order.dateAdded.asc',
  'library.sort.order.dateAdded.desc',
  'library.sort.order.releaseYear.asc',
  'library.sort.order.releaseYear.desc',
  'library.sort.order.title.asc',
  'library.sort.order.title.desc',
  'library.sort.order.userRating.asc',
  'library.sort.order.userRating.desc',
  'library.sort.releaseYear',
  'library.sort.title',
  'library.sort.userRating',
  'library.tabs.watched',
  'library.tabs.watchlist',
  'modal.cancel',
  'modal.confirm',
  'nav.calendar',
  'nav.home',
  'nav.library',
  'nav.recommendations',
  'nav.settings',
  'page.calendar.title',
  'page.home.title',
  'page.library.title',
  'page.movie.title',
  'page.recommendations.title',
  'page.settings.title',
  'page.show.title',
  'recommendations.becauseYouLiked',
  'recommendations.becauseYouWatched',
  'recommendations.popular.movies.title',
  'recommendations.popular.shows.title',
  'recommendations.scrollNext',
  'recommendations.scrollPrevious',
  'recommendations.title',
  'recommendations.trending.title',
  'settings.title',
  'settings.description',
  'settings.sections.appearance',
  'settings.sections.content',
  'settings.sections.data',
  'settings.appearance.theme.label',
  'settings.appearance.theme.description',
  'settings.content.language.label',
  'settings.content.language.description',
  'settings.data.info.title',
  'settings.data.info.description',
  'settings.data.export',
  'settings.data.exportError',
  'settings.data.exportSuccess',
  'settings.data.import',
  'settings.data.importError',
  'settings.data.importSuccess',
  'settings.import.title',
  'settings.import.description',
  'settings.import.merge',
  'settings.import.overwrite',
  'settings.import.confirmOverwriteButton',
  'settings.import.confirmOverwriteDescription',
  'settings.import.confirmOverwriteTitle',
  'settings.delete.button',
  'settings.delete.confirm',
  'settings.delete.description',
  'settings.delete.error',
  'settings.delete.success',
  'settings.delete.title',
  'toast.dismiss',
  'toast.error',
  'toast.retry',
].sort()

const KEY_SEGMENT_PATTERN = /^[a-z][a-zA-Z0-9]*$/

function readLocale(filename: string): Record<string, unknown> {
  const raw = readFileSync(resolve(LOCALES_DIR, filename), 'utf-8')
  return JSON.parse(raw) as Record<string, unknown>
}

describe('locale key parity', () => {
  const locales = Object.fromEntries(LOCALE_FILES.map((file) => [file, readLocale(file)]))

  it('all three locale files exist and parse as valid JSON', () => {
    for (const file of LOCALE_FILES) {
      expect(locales[file]).toBeDefined()
      expect(typeof locales[file]).toBe('object')
    }
  })

  it('all three files contain identical key paths', () => {
    const enKeys = Object.keys(locales['en.json']).sort()
    const esKeys = Object.keys(locales['es.json']).sort()
    const frKeys = Object.keys(locales['fr.json']).sort()

    expect(esKeys).toEqual(enKeys)
    expect(frKeys).toEqual(enKeys)
  })

  it('all translation values are non-empty strings', () => {
    for (const [file, locale] of Object.entries(locales)) {
      for (const [key, value] of Object.entries(locale)) {
        expect(value, `${file} key "${key}" must be a non-empty string`).toBeTypeOf('string')
        expect(
          (value as string).trim().length,
          `${file} key "${key}" must not be empty`,
        ).toBeGreaterThan(0)
      }
    }
  })

  it('contains exactly the expected keys', () => {
    const enKeys = Object.keys(locales['en.json']).sort()
    expect(enKeys).toEqual(EXPECTED_KEYS)
  })

  it('preserves app.title with its original value', () => {
    for (const [file, locale] of Object.entries(locales)) {
      expect(locale['app.title'], `${file} must preserve app.title`).toBe('Plot Twisted')
    }
  })

  it('every key segment matches camelCase pattern', () => {
    const keys = Object.keys(locales['en.json'])
    for (const key of keys) {
      for (const segment of key.split('.')) {
        expect(segment, `segment "${segment}" in key "${key}"`).toMatch(KEY_SEGMENT_PATTERN)
      }
    }
  })
})
