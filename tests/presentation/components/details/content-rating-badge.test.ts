import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContentRatingBadge from '@/presentation/components/details/content-rating-badge.vue'

describe('ContentRatingBadge', () => {
  it('renders the rating when provided', () => {
    const wrapper = mount(ContentRatingBadge, {
      props: { rating: 'PG-13' },
    })

    expect(wrapper.find('[data-testid="content-rating-badge"]').exists()).toBe(true)
    expect(wrapper.text()).toBe('PG-13')
  })

  it('does not render when rating is null', () => {
    const wrapper = mount(ContentRatingBadge, {
      props: { rating: null },
    })

    expect(wrapper.find('[data-testid="content-rating-badge"]').exists()).toBe(false)
  })

  it('does not render when rating is empty string', () => {
    const wrapper = mount(ContentRatingBadge, {
      props: { rating: '' },
    })

    expect(wrapper.find('[data-testid="content-rating-badge"]').exists()).toBe(false)
  })

  it('renders various rating formats', () => {
    const ratings = ['R', 'TV-MA', 'G', 'NC-17', '18+']

    for (const rating of ratings) {
      const wrapper = mount(ContentRatingBadge, {
        props: { rating },
      })

      expect(wrapper.text()).toBe(rating)
    }
  })
})
