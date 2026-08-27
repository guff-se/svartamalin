/**
 * Skriv ut välkomsttext, skuta och roll (svartvitt, utan bilder).
 * Vad som syns på papper styrs av src/styles/print.css.
 */
export function bindPrintIntriger(btn) {
  const el = btn ?? document.getElementById('print-intriger-btn')
  if (!el) return
  el.addEventListener('click', () => window.print())
}
