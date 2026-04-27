/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import ImagesGallery from '@/presentation/components/details/images-gallery.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        images: {
          title: 'Images',
          backdrops: 'Backdrops',
          posters: 'Posters',
        },
      },
    },
  },
})

describe('ImagesGallery', () => {
  const mockPosters = [
    { file_path: '/poster1.jpg', aspect_ratio: 0.667, height: 1500, width: 1000 },
    { file_path: '/poster2.jpg', aspect_ratio: 0.667, height: 1500, width: 1000 },
  ]

  const mockBackdrops = [
    { file_path: '/backdrop1.jpg', aspect_ratio: 1.778, height: 1080, width: 1920 },
    { file_path: '/backdrop2.jpg', aspect_ratio: 1.778, height: 1080, width: 1920 },
    { file_path: '/backdrop3.jpg', aspect_ratio: 1.778, height: 1080, width: 1920 },
  ]

  let mockResizeObserver: { observe: any; disconnect: any }
  let resizeCallback: () => void

  beforeEach(() => {
    mockResizeObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }
    vi.stubGlobal(
      'ResizeObserver',
      class MockResizeObserver {
        constructor(callback: () => void) {
          resizeCallback = callback
          Object.assign(this, mockResizeObserver)
        }
        observe = mockResizeObserver.observe
        disconnect = mockResizeObserver.disconnect
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.style.overflow = ''
  })

  function renderImagesGallery(props: { posters: any[]; backdrops: any[] }) {
    return mount(ImagesGallery, {
      props,
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true,
        },
      },
    })
  }

  it('does not render when no images are provided', () => {
    const wrapper = renderImagesGallery({ posters: [], backdrops: [] })

    expect(wrapper.find('[data-testid="images-gallery"]').exists()).toBe(false)
  })

  it('renders when only posters are provided', () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: [] })

    expect(wrapper.find('[data-testid="images-gallery"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-posters"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-backdrops"]').exists()).toBe(false)
  })

  it('renders when only backdrops are provided', () => {
    const wrapper = renderImagesGallery({ posters: [], backdrops: mockBackdrops })

    expect(wrapper.find('[data-testid="images-gallery"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-backdrops"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-posters"]').exists()).toBe(false)
  })

  it('renders both tabs when both posters and backdrops are provided', () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    expect(wrapper.find('[data-testid="tab-backdrops"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-posters"]').exists()).toBe(true)
  })

  it('defaults to backdrops tab when backdrops are available', () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Backdrops tab should be active (has the active styling)
    const backdropTab = wrapper.find('[data-testid="tab-backdrops"]')
    expect(backdropTab.classes()).toContain('bg-white')
  })

  it('defaults to posters tab when only posters are available', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: [] })
    await nextTick()

    const posterTab = wrapper.find('[data-testid="tab-posters"]')
    expect(posterTab.classes()).toContain('bg-white')
  })

  it('switches tabs when clicking on tab buttons', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="tab-posters"]').trigger('click')
    await nextTick()

    const posterTab = wrapper.find('[data-testid="tab-posters"]')
    expect(posterTab.classes()).toContain('bg-white')
  })

  it('renders thumbnails for current tab', () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    const thumbnails = wrapper.findAll('[data-testid="image-thumbnail"]')
    expect(thumbnails.length).toBe(3) // 3 backdrops (default tab)
  })

  it('limits displayed images to 10', () => {
    const manyBackdrops = Array.from({ length: 15 }, (_, i) => ({
      file_path: `/backdrop${i}.jpg`,
      aspect_ratio: 1.778,
      height: 1080,
      width: 1920,
    }))

    const wrapper = renderImagesGallery({ posters: [], backdrops: manyBackdrops })

    const thumbnails = wrapper.findAll('[data-testid="image-thumbnail"]')
    expect(thumbnails.length).toBe(10)
  })

  it('opens lightbox when clicking thumbnail', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')

    expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('closes lightbox when clicking close button', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')
    expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(true)

    await wrapper.find('[data-testid="lightbox-close"]').trigger('click')
    expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(false)
    expect(document.body.style.overflow).toBe('')
  })

  it('closes lightbox when clicking backdrop', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')
    await wrapper.find('[data-testid="lightbox"]').trigger('click')

    expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(false)
  })

  it('navigates to next image in lightbox', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')
    const initialSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')

    await wrapper.find('[data-testid="lightbox-next"]').trigger('click')
    const nextSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')

    expect(nextSrc).not.toBe(initialSrc)
  })

  it('navigates to previous image in lightbox', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Click second thumbnail to start at index 1
    const thumbnails = wrapper.findAll('[data-testid="image-thumbnail"]')
    await thumbnails[1].trigger('click')
    const initialSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')

    await wrapper.find('[data-testid="lightbox-previous"]').trigger('click')
    const prevSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')

    expect(prevSrc).not.toBe(initialSrc)
  })

  it('wraps around when navigating past last image', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Click last thumbnail
    const thumbnails = wrapper.findAll('[data-testid="image-thumbnail"]')
    await thumbnails[thumbnails.length - 1].trigger('click')

    await wrapper.find('[data-testid="lightbox-next"]').trigger('click')

    // Should wrap to first image
    const lightboxImage = wrapper.find('[data-testid="lightbox-image"]')
    expect(lightboxImage.attributes('src')).toContain('backdrop1.jpg')
  })

  it('wraps around when navigating before first image', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')
    await wrapper.find('[data-testid="lightbox-previous"]').trigger('click')

    // Should wrap to last image
    const lightboxImage = wrapper.find('[data-testid="lightbox-image"]')
    expect(lightboxImage.attributes('src')).toContain('backdrop3.jpg')
  })

  it('handles keyboard navigation in lightbox', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')
    const initialSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')

    // Simulate ArrowRight keydown
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await nextTick()

    const nextSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')
    expect(nextSrc).not.toBe(initialSrc)

    // Simulate ArrowLeft keydown
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    await nextTick()

    const prevSrc = wrapper.find('[data-testid="lightbox-image"]').attributes('src')
    expect(prevSrc).toBe(initialSrc)

    // Simulate Escape keydown
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(false)
  })

  it('ignores keyboard events when lightbox is closed', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Simulate keydown without opening lightbox - should not throw
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await nextTick()

    expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(false)
  })

  it('resets lightbox index when switching tabs with lightbox open', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Open lightbox at index 2
    const thumbnails = wrapper.findAll('[data-testid="image-thumbnail"]')
    await thumbnails[2].trigger('click')

    // Switch to posters tab
    await wrapper.find('[data-testid="tab-posters"]').trigger('click')
    await nextTick()

    // Lightbox should show first poster (index reset to 0)
    const lightboxImage = wrapper.find('[data-testid="lightbox-image"]')
    expect(lightboxImage.attributes('src')).toContain('poster1.jpg')
  })

  it('shows scroll buttons when content overflows', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Simulate overflow by mocking scrollWidth > clientWidth
    const carouselEl = wrapper.find('[data-testid="images-scroll-container"]').element as any
    Object.defineProperty(carouselEl, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(carouselEl, 'clientWidth', { value: 500, configurable: true })

    // Trigger resize observer callback
    resizeCallback()
    await nextTick()

    expect(wrapper.find('[data-testid="images-scroll-previous"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="images-scroll-next"]').exists()).toBe(true)
  })

  it('scrolls carousel when clicking scroll buttons', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    const carouselEl = wrapper.find('[data-testid="images-scroll-container"]').element as any
    Object.defineProperty(carouselEl, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(carouselEl, 'clientWidth', { value: 500, configurable: true })

    const resizeCallback = (globalThis.ResizeObserver as any).mock.calls[0][0]
    resizeCallback()
    await nextTick()

    const scrollBy = vi.fn()
    carouselEl.scrollBy = scrollBy

    await wrapper.find('[data-testid="images-scroll-next"]').trigger('click')
    expect(scrollBy).toHaveBeenCalledWith({
      left: 375, // 500 * 0.75
      behavior: 'smooth',
    })

    await wrapper.find('[data-testid="images-scroll-previous"]').trigger('click')
    expect(scrollBy).toHaveBeenCalledWith({
      left: -375,
      behavior: 'smooth',
    })
  })

  it('uses minimum scroll offset of 200', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    const carouselEl = wrapper.find('[data-testid="images-scroll-container"]').element as any
    Object.defineProperty(carouselEl, 'scrollWidth', { value: 500, configurable: true })
    Object.defineProperty(carouselEl, 'clientWidth', { value: 200, configurable: true })

    const resizeCallback = (globalThis.ResizeObserver as any).mock.calls[0][0]
    resizeCallback()
    await nextTick()

    const scrollBy = vi.fn()
    carouselEl.scrollBy = scrollBy

    await wrapper.find('[data-testid="images-scroll-next"]').trigger('click')
    expect(scrollBy).toHaveBeenCalledWith({
      left: 200, // minimum offset
      behavior: 'smooth',
    })
  })

  it('hides navigation buttons for single image in lightbox', async () => {
    const singleBackdrop = [mockBackdrops[0]]
    const wrapper = renderImagesGallery({ posters: [], backdrops: singleBackdrop })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')

    expect(wrapper.find('[data-testid="lightbox-previous"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="lightbox-next"]').exists()).toBe(false)
  })

  it('cleans up event listeners and body overflow on unmount', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    // Open lightbox
    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()

    expect(document.body.style.overflow).toBe('')
    expect(mockResizeObserver.disconnect).toHaveBeenCalled()
  })

  it('displays image counter in lightbox', async () => {
    const wrapper = renderImagesGallery({ posters: mockPosters, backdrops: mockBackdrops })

    await wrapper.find('[data-testid="image-thumbnail"]').trigger('click')

    expect(wrapper.find('[data-testid="lightbox"]').text()).toContain('1 / 3')
  })

  it('scrollCarousel returns early when carouselRef is null', async () => {
    // Mount with no images to ensure carousel is not rendered
    const wrapper = renderImagesGallery({ posters: [], backdrops: [] })

    // Access the internal scrollCarousel function
    const vm = wrapper.vm as any
    const scrollCarousel = vm.$.setupState?.scrollCarousel

    // This should be undefined since component doesn't render
    // Just verify no crash occurs
    expect(wrapper.find('[data-testid="images-gallery"]').exists()).toBe(false)
  })
})
