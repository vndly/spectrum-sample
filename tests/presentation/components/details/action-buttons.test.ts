import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionButtons from '@/presentation/components/details/action-buttons.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        actions: {
          favorite: 'Add to favorites',
          unfavorite: 'Remove from favorites',
          watchlist: 'Add to watchlist',
          watched: 'Mark as watched',
          removeStatus: 'Remove from list',
          share: 'Share',
          imdb: 'View on IMDB',
        },
      },
    },
  },
})

describe('ActionButtons', () => {
  const defaultProps = {
    favorite: false,
    status: 'none' as const,
    imdbId: null,
    shareUrl: '/movie/550',
    shareTitle: 'Fight Club',
  }

  it('favorite button toggles state and emits event (ED-07-01)', async () => {
    // Arrange
    const wrapper = mount(ActionButtons, {
      props: defaultProps,
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="favorite-button"]').trigger('click')

    // Assert
    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
  })

  it('favorite button shows filled heart when favorited (ED-07-02)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, favorite: true },
      global: { plugins: [i18n] },
    })

    // Assert
    const btn = wrapper.find('[data-testid="favorite-button"]')
    expect(btn.classes()).toContain('bg-accent')
  })

  it('favorite button shows outline heart when not favorited (ED-07-03)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, favorite: false },
      global: { plugins: [i18n] },
    })

    // Assert
    const btn = wrapper.find('[data-testid="favorite-button"]')
    expect(btn.classes()).toContain('bg-surface')
  })

  it('watchlist button sets status (ED-08-01)', async () => {
    // Arrange
    const wrapper = mount(ActionButtons, {
      props: defaultProps,
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="watchlist-button"]').trigger('click')

    // Assert
    expect(wrapper.emitted('update-status')).toBeTruthy()
    expect(wrapper.emitted('update-status')?.[0]).toEqual(['watchlist'])
  })

  it('watched button sets status (ED-08-02)', async () => {
    // Arrange
    const wrapper = mount(ActionButtons, {
      props: defaultProps,
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="watched-button"]').trigger('click')

    // Assert
    expect(wrapper.emitted('update-status')?.[0]).toEqual(['watched'])
  })

  it('clicking active status button clears it to none (ED-08-03)', async () => {
    // Arrange
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, status: 'watchlist' },
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="watchlist-button"]').trigger('click')

    // Assert
    expect(wrapper.emitted('update-status')?.[0]).toEqual(['none'])
  })

  it('shows active state for watchlist button (ED-08-04)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, status: 'watchlist' },
      global: { plugins: [i18n] },
    })

    // Assert
    const btn = wrapper.find('[data-testid="watchlist-button"]')
    expect(btn.classes()).toContain('bg-accent')
  })

  it('shows active state for watched button (ED-08-05)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, status: 'watched' },
      global: { plugins: [i18n] },
    })

    // Assert
    const btn = wrapper.find('[data-testid="watched-button"]')
    expect(btn.classes()).toContain('bg-accent')
  })

  it('IMDB button renders when imdb_id present (ED-09-01)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, imdbId: 'tt0137523' },
      global: { plugins: [i18n] },
    })

    // Assert
    const link = wrapper.find('[data-testid="imdb-link"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://www.imdb.com/title/tt0137523')
  })

  it('IMDB button not rendered when imdb_id null (ED-09-02)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, imdbId: null },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="imdb-link"]').exists()).toBe(false)
  })

  it('IMDB link has rel="noopener noreferrer" (ED-NFR-09)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, imdbId: 'tt0137523' },
      global: { plugins: [i18n] },
    })

    // Assert
    const link = wrapper.find('[data-testid="imdb-link"]')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('share button has aria-label="Share" (ED-NFR-08)', () => {
    // Arrange & Act
    const wrapper = mount(ActionButtons, {
      props: defaultProps,
      global: { plugins: [i18n] },
    })

    // Assert
    const btn = wrapper.find('[data-testid="share-button"]')
    expect(btn.attributes('aria-label')).toBe('Share')
  })

  it('share button emits share event (ED-10-01)', async () => {
    // Arrange
    const wrapper = mount(ActionButtons, {
      props: defaultProps,
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="share-button"]').trigger('click')

    // Assert
    expect(wrapper.emitted('share')).toBeTruthy()
  })

  it('manage lists button emits and reflects the active list state', async () => {
    const wrapper = mount(ActionButtons, {
      props: { ...defaultProps, hasLists: true },
      global: { plugins: [i18n] },
    })

    const button = wrapper.get('[data-testid="manage-lists-button"]')
    expect(button.classes()).toContain('bg-accent')

    await button.trigger('click')

    expect(wrapper.emitted('manage-lists')).toBeTruthy()
  })
})
