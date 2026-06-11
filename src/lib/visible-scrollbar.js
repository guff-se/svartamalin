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

  const update = () => {
    const { scrollTop, scrollHeight, clientHeight } = scroller
    const overflow = scrollHeight > clientHeight + 1
    track.hidden = !overflow
    if (!overflow) return

    const trackH = track.clientHeight
    const thumbH = Math.max(40, (clientHeight / scrollHeight) * trackH)
    const maxScroll = scrollHeight - clientHeight
    const maxThumbTop = trackH - thumbH
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0
    thumb.style.height = `${thumbH}px`
    thumb.style.transform = `translateY(${top}px)`
  }

  scroller.addEventListener('scroll', update, { passive: true })
  const ro = new ResizeObserver(update)
  ro.observe(scroller)
  update()

  const unbind = () => {
    scroller.removeEventListener('scroll', update)
    ro.disconnect()
    delete scroller._syncScrollbar
    delete scroller._unbindScrollbar
  }

  scroller._syncScrollbar = update
  scroller._unbindScrollbar = unbind
  return unbind
}
