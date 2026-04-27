import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ExternalLinks from '@/presentation/components/details/external-links.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        links: {
          title: 'External Links',
          homepage: 'Homepage',
        },
        actions: {
          imdb: 'View on IMDb',
        },
      },
    },
  },
})

describe('ExternalLinks', () => {
  function renderExternalLinks(props: Record<string, string | null | undefined> = {}) {
    return mount(ExternalLinks, {
      props,
      global: { plugins: [i18n] },
    })
  }

  it('does not render when no links are provided', () => {
    const wrapper = renderExternalLinks()

    expect(wrapper.find('[data-testid="external-links"]').exists()).toBe(false)
  })

  it('renders section when IMDb ID is provided', () => {
    const wrapper = renderExternalLinks({ imdbId: 'tt0137523' })

    expect(wrapper.find('[data-testid="external-links"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-imdb"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-imdb"]').attributes('href')).toBe(
      'https://www.imdb.com/title/tt0137523',
    )
  })

  it('renders homepage link when homepage is provided', () => {
    const wrapper = renderExternalLinks({ homepage: 'https://example.com' })

    expect(wrapper.find('[data-testid="link-homepage"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-homepage"]').attributes('href')).toBe(
      'https://example.com',
    )
  })

  it('renders Facebook link when facebookId is provided', () => {
    const wrapper = renderExternalLinks({ facebookId: 'FightClubMovie' })

    expect(wrapper.find('[data-testid="link-facebook"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-facebook"]').attributes('href')).toBe(
      'https://www.facebook.com/FightClubMovie',
    )
  })

  it('renders Instagram link when instagramId is provided', () => {
    const wrapper = renderExternalLinks({ instagramId: 'fightclub' })

    expect(wrapper.find('[data-testid="link-instagram"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-instagram"]').attributes('href')).toBe(
      'https://www.instagram.com/fightclub',
    )
  })

  it('renders Twitter link when twitterId is provided', () => {
    const wrapper = renderExternalLinks({ twitterId: 'fightclub' })

    expect(wrapper.find('[data-testid="link-twitter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-twitter"]').attributes('href')).toBe(
      'https://twitter.com/fightclub',
    )
  })

  it('renders all links when all IDs are provided', () => {
    const wrapper = renderExternalLinks({
      imdbId: 'tt0137523',
      homepage: 'https://example.com',
      facebookId: 'FightClubMovie',
      instagramId: 'fightclub',
      twitterId: 'fightclub',
    })

    expect(wrapper.find('[data-testid="link-imdb"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-homepage"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-facebook"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-instagram"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="link-twitter"]').exists()).toBe(true)
  })

  it('does not render links for null values', () => {
    const wrapper = renderExternalLinks({
      imdbId: null,
      homepage: null,
      facebookId: null,
      instagramId: null,
      twitterId: null,
    })

    expect(wrapper.find('[data-testid="external-links"]').exists()).toBe(false)
  })

  it('links open in new tab with proper security attributes', () => {
    const wrapper = renderExternalLinks({ imdbId: 'tt0137523' })

    const link = wrapper.find('[data-testid="link-imdb"]')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders title header', () => {
    const wrapper = renderExternalLinks({ imdbId: 'tt0137523' })

    expect(wrapper.find('h2').text()).toBe('External Links')
  })
})
