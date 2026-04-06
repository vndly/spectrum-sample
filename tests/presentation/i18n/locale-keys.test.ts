import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const LOCALES_DIR = resolve(process.cwd(), 'src/presentation/i18n/locales')
const LOCALE_FILES = ['en.json', 'es.json', 'fr.json'] as const

const EXPECTED_KEYS = [
  'app.title',
  'common.empty.description',
  'common.empty.title',
  'common.error.description',
  'common.error.reload',
  'common.error.title',
  'details.actions.favorite',
  'details.actions.imdb',
  'details.actions.manageLists',
  'details.actions.removeStatus',
  'details.actions.share',
  'details.actions.unfavorite',
  'details.actions.watched',
  'details.actions.watchlist',
  'details.boxOffice.budget',
  'details.boxOffice.revenue',
  'details.boxOffice.title',
  'details.cast.title',
  'details.error.retry',
  'details.error.title',
  'details.loading',
  'details.metadata.director',
  'details.metadata.directors',
  'details.metadata.episodes',
  'details.metadata.seasons',
  'details.metadata.writer',
  'details.metadata.writers',
  'details.notFound.home',
  'details.notFound.message',
  'details.notFound.title',
  'details.share.copied',
  'details.streaming.notAvailable',
  'details.trailer.play',
  'details.trailer.title',
  'home.browse.error.message',
  'home.browse.error.retry',
  'home.browse.popularMovies',
  'home.browse.popularShows',
  'home.browse.trending',
  'home.filters.clear',
  'home.filters.genre',
  'home.filters.grid',
  'home.filters.list',
  'home.filters.mediaType.all',
  'home.filters.mediaType.movie',
  'home.filters.mediaType.tv',
  'home.filters.yearFrom',
  'home.filters.yearTo',
  'home.search.clear',
  'home.search.empty.subtitle',
  'home.search.empty.title',
  'home.search.error.message',
  'home.search.error.retry',
  'home.search.placeholder',
  'library.empty.allLists.description',
  'library.empty.allLists.title',
  'library.empty.list.description',
  'library.empty.list.title',
  'library.empty.watched.description',
  'library.empty.watched.title',
  'library.empty.watchlist.description',
  'library.empty.watchlist.title',
  'library.lists.manageTitle',
  'library.lists.newNamePlaceholder',
  'library.lists.noLists',
  'library.tabs.lists',
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
  'page.stats.title',
  'toast.dismiss',
  'toast.error',
  'toast.retry',
].sort()

const CAMEL_CASE_SEGMENT = /^[a-z][a-zA-Z0-9]*$/

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
        expect(segment, `segment "${segment}" in key "${key}"`).toMatch(CAMEL_CASE_SEGMENT)
      }
    }
  })
})
