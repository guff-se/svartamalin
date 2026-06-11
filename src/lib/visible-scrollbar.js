/** Egen scrollbar som alltid syns (macOS Chrome döljer native overlay-scrollbars). */
export function bindVisibleScrollbar(scroller) {
  if (scroller._syncScrollbar) {
    scroller._syncScrollbar()
    return scroller._unbindScrollbar
  }

  const track = scroller.closest('.name-grid-scroller')
    ?.querySelector('.name-grid-scrollbar')
  const thumb = track?.querySelector('.name-grid-scrollbar__thumb')
  if (!track || !thumb) return () => {}

  const metrics = () => {
    const { scrollHeight, clientHeight } = scroller
    const trackH = track.clientHeight
    const thumbH = Math.max(40, (clientHeight / scrollHeight) * trackH)
    const maxScroll = scrollHeight - clientHeight
    const maxThumbTop = trackH - thumbH
    return { trackH, thumbH, maxScroll, maxThumbTop }
  }

  const scrollFromThumbTop = (thumbTop) => {
    const { maxScroll, maxThumbTop } = metrics()
    if (maxThumbTop <= 0) return
    scroller.scrollTop = (thumbTop / maxThumbTop) * maxScroll
  }

  const update = () => {
    const { scrollTop, scrollHeight, clientHeight } = scroller
    const overflow = scrollHeight > clientHeight + 1
    track.hidden = !overflow
    if (!overflow) return

    const { trackH, thumbH, maxScroll, maxThumbTop } = metrics()
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0
    thumb.style.height = `${thumbH}px`
    thumb.style.transform = `translateY(${top}px)`
  }

  const onTrackPointerDown = (e) => {
    if (e.target !== track) return
    e.preventDefault()
    const rect = track.getBoundingClientRect()
    const { thumbH, maxThumbTop } = metrics()
    const thumbTop = Math.min(Math.max(e.clientY - rect.top - thumbH / 2, 0), maxThumbTop)
    scrollFromThumbTop(thumbTop)
    update()
  }

  const onThumbPointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const trackRect = track.getBoundingClientRect()
    const grabOffsetY = e.clientY - thumb.getBoundingClientRect().top
    track.classList.add('is-dragging')

    const onMove = (ev) => {
      const { thumbH, maxThumbTop } = metrics()
      const thumbTop = Math.min(
        Math.max(ev.clientY - trackRect.top - grabOffsetY, 0),
        maxThumbTop,
      )
      scrollFromThumbTop(thumbTop)
    }

    const onUp = () => {
      track.classList.remove('is-dragging')
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
  }

  scroller.addEventListener('scroll', update, { passive: true })
  track.addEventListener('pointerdown', onTrackPointerDown)
  thumb.addEventListener('pointerdown', onThumbPointerDown)
  const ro = new ResizeObserver(update)
  ro.observe(scroller)
  update()

  const unbind = () => {
    scroller.removeEventListener('scroll', update)
    track.removeEventListener('pointerdown', onTrackPointerDown)
    thumb.removeEventListener('pointerdown', onThumbPointerDown)
    ro.disconnect()
    track.classList.remove('is-dragging')
    delete scroller._syncScrollbar
    delete scroller._unbindScrollbar
  }

  scroller._syncScrollbar = update
  scroller._unbindScrollbar = unbind
  return unbind
}
