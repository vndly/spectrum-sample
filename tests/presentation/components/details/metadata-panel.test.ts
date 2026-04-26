import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetadataPanel from '@/presentation/components/details/metadata-panel.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        metadata: {
          director: 'Director',
          directors: 'Directors',
          writer: 'Writer',
          writers: 'Writers',
          seasons: 'Seasons',
          episodes: 'Episodes',
          language: 'Language',
        },
      },
    },
  },
})

describe('MetadataPanel', () => {
  const defaultProps = {
    genres: [],
    crew: [],
    spokenLanguages: [],
  }

  it('renders year from release_date (ED-02-01)', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps, releaseDate: '1999-10-15' },
      global: { plugins: [i18n] },
    })

    // Assert
    const year = wrapper.find('[data-testid="year"]')
    expect(year.exists()).toBe(true)
    expect(year.text()).toBe('1999')
  })

  it('renders year from first_air_date for TV shows', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps, firstAirDate: '2008-01-20' },
      global: { plugins: [i18n] },
    })

    // Assert
    const year = wrapper.find('[data-testid="year"]')
    expect(year.exists()).toBe(true)
    expect(year.text()).toBe('2008')
  })

  it('renders runtime formatted as hours/minutes for movies (ED-02-02)', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps, runtime: 139 },
      global: { plugins: [i18n] },
    })

    // Assert
    const runtime = wrapper.find('[data-testid="runtime"]')
    expect(runtime.exists()).toBe(true)
    expect(runtime.text()).toBe('2h 19m')
  })

  it('renders runtime with only hours when minutes are 0', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps, runtime: 120 },
      global: { plugins: [i18n] },
    })

    // Assert
    const runtime = wrapper.find('[data-testid="runtime"]')
    expect(runtime.text()).toBe('2h')
  })

  it('renders runtime with only minutes when less than hour', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps, runtime: 45 },
      global: { plugins: [i18n] },
    })

    // Assert
    const runtime = wrapper.find('[data-testid="runtime"]')
    expect(runtime.text()).toBe('45m')
  })

  it('renders season/episode count for TV shows (ED-02-03)', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps, numberOfSeasons: 5, numberOfEpisodes: 62 },
      global: { plugins: [i18n] },
    })

    // Assert
    const seasonInfo = wrapper.find('[data-testid="season-info"]')
    expect(seasonInfo.exists()).toBe(true)
    expect(seasonInfo.text()).toContain('5')
    expect(seasonInfo.text()).toContain('62')
  })

  it('renders genres as pills (ED-02-04)', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: {
        ...defaultProps,
        genres: [
          { id: 18, name: 'Drama' },
          { id: 53, name: 'Thriller' },
        ],
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const genres = wrapper.find('[data-testid="genres"]')
    expect(genres.exists()).toBe(true)
    expect(genres.text()).toContain('Drama')
    expect(genres.text()).toContain('Thriller')
  })

  it('renders directors list (ED-02-05)', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: {
        ...defaultProps,
        crew: [
          {
            id: 1,
            name: 'David Fincher',
            job: 'Director',
            department: 'Directing',
            profile_path: null,
          },
        ],
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const directors = wrapper.find('[data-testid="directors"]')
    expect(directors.exists()).toBe(true)
    expect(directors.text()).toContain('David Fincher')
    expect(directors.text()).toContain('Director')
  })

  it('renders plural directors label', () => {
    const wrapper = mount(MetadataPanel, {
      props: {
        ...defaultProps,
        releaseDate: '2010-01-01',
        runtime: 120,
        genres: [{ id: 1, name: 'Drama' }],
        crew: [
          {
            id: 1,
            name: 'Director One',
            job: 'Director',
            department: 'Directing',
            profile_path: null,
          },
          {
            id: 2,
            name: 'Director Two',
            job: 'Director',
            department: 'Directing',
            profile_path: null,
          },
        ],
      },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('2010')
    expect(wrapper.get('[data-testid="directors"]').text()).toContain('Directors')
  })

  it('renders spoken languages (ED-02-06)', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: {
        ...defaultProps,
        spokenLanguages: [
          { iso_639_1: 'en', name: 'English', english_name: 'English' },
          { iso_639_1: 'es', name: 'Español', english_name: 'Spanish' },
        ],
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const languages = wrapper.find('[data-testid="languages"]')
    expect(languages.exists()).toBe(true)
    expect(languages.text()).toContain('English')
    expect(languages.text()).toContain('Spanish')
  })

  it('omits missing fields instead of showing empty', () => {
    // Arrange & Act
    const wrapper = mount(MetadataPanel, {
      props: { ...defaultProps },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="year"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="runtime"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="genres"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="directors"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="languages"]').exists()).toBe(false)
  })
})
