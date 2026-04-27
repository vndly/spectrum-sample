import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import SearchBar from '@/presentation/components/home/search-bar.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'home.search.placeholder': 'Search movies and shows...',
      'home.search.clear': 'Clear search',
    },
  },
})

describe('SearchBar', () => {
  const mountComponent = (props = {}) => {
    return mount(SearchBar, {
      props: {
        modelValue: '',
        ...props,
      },
      global: {
        plugins: [i18n],
      },
    })
  }

  it('updates v-model on input', async () => {
    // Arrange
    const wrapper = mountComponent()
    const input = wrapper.find('input')

    // Act
    await input.setValue('test query')

    // Assert
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual(['test query'])
  })

  it('shows clear button when input is non-empty', async () => {
    // Arrange
    const wrapper = mountComponent({ modelValue: 'test' })

    // Assert
    expect(wrapper.find('[aria-label="Clear search"]').exists()).toBe(true)
  })

  it('hides clear button when input is empty', () => {
    // Arrange
    const wrapper = mountComponent({ modelValue: '' })

    // Assert
    expect(wrapper.find('[aria-label="Clear search"]').exists()).toBe(false)
  })

  it('emits empty string when clear button is clicked (HS-11-03)', async () => {
    // Arrange
    const wrapper = mountComponent({ modelValue: 'test query' })
    const clearButton = wrapper.find('[aria-label="Clear search"]')

    // Act
    await clearButton.trigger('click')

    // Assert
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual([''])
  })

  it('has correct aria-label on clear button for accessibility', () => {
    // Arrange
    const wrapper = mountComponent({ modelValue: 'test' })

    // Assert
    const clearButton = wrapper.find('button')
    expect(clearButton.attributes('aria-label')).toBe('Clear search')
  })

  it('has type="search" on input for accessibility (HS-NFR-06)', () => {
    // Arrange
    const wrapper = mountComponent()

    // Assert
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('search')
  })

  it('focuses the input on mount when autofocus is enabled', () => {
    // Arrange
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
        autofocus: true,
      },
      attachTo: document.body,
      global: {
        plugins: [i18n],
      },
    })

    // Assert
    expect(document.activeElement).toBe(wrapper.get('input').element)

    wrapper.unmount()
  })

  it('suppresses native search field controls in favor of the custom clear button', () => {
    // Arrange
    const wrapper = mountComponent({ modelValue: 'test' })

    // Assert
    const input = wrapper.find('input')
    expect(input.attributes('class')).toContain('[&::-webkit-search-cancel-button]:appearance-none')
    expect(input.attributes('class')).toContain('[&::-webkit-search-decoration]:appearance-none')
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.find('[aria-label="Clear search"]').exists()).toBe(true)
  })

  it('has placeholder text (HS-NFR-06)', () => {
    // Arrange
    const wrapper = mountComponent()

    // Assert
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Search movies and shows...')
  })

  it('has search icon', () => {
    // Arrange
    const wrapper = mountComponent()

    // Assert - check for the lucide search icon by data-testid or svg presence
    expect(wrapper.find('[data-testid="search-icon"]').exists()).toBe(true)
  })

  it('focuses the input on activation when autofocus is enabled', async () => {
    // Arrange - Use KeepAlive to trigger onActivated
    const showSearch = ref(true)
    const WrapperComponent = {
      components: { SearchBar },
      setup() {
        return { showSearch }
      },
      template: `
        <KeepAlive>
          <SearchBar v-if="showSearch" modelValue="" autofocus />
        </KeepAlive>
      `,
    }

    const wrapper = mount(WrapperComponent, {
      attachTo: document.body,
      global: {
        plugins: [i18n],
      },
    })

    // Wait for initial mount
    await nextTick()

    // Deactivate the component
    showSearch.value = false
    await nextTick()

    // Focus something else
    document.body.focus()

    // Reactivate the component (triggers onActivated)
    showSearch.value = true
    await nextTick()
    await nextTick()

    // Assert - input should be focused again
    const input = wrapper.find('input')
    expect(document.activeElement).toBe(input.element)

    wrapper.unmount()
  })

  it('does not focus the input on activation when autofocus is disabled', async () => {
    // Arrange - Use KeepAlive to trigger onActivated with autofocus=false
    const showSearch = ref(true)
    const WrapperComponent = {
      components: { SearchBar },
      setup() {
        return { showSearch }
      },
      template: `
        <KeepAlive>
          <SearchBar v-if="showSearch" modelValue="" :autofocus="false" />
        </KeepAlive>
      `,
    }

    const wrapper = mount(WrapperComponent, {
      attachTo: document.body,
      global: {
        plugins: [i18n],
      },
    })

    // Wait for initial mount
    await nextTick()

    // Deactivate the component
    showSearch.value = false
    await nextTick()

    // Focus something else
    document.body.focus()

    // Reactivate the component (triggers onActivated)
    showSearch.value = true
    await nextTick()
    await nextTick()

    // Assert - input should NOT be focused (autofocus is false)
    const input = wrapper.find('input')
    expect(document.activeElement).not.toBe(input.element)

    wrapper.unmount()
  })
})
