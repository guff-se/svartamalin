/** Portrait filename from guest real name: "Gustaf Tadaa" → gustaf-tadaa.jpg */
export function portraitPath(realName) {
  const slug = String(realName).trim().toLowerCase().replace(/\s+/g, '-')
  return `/images/portraits/${slug}.jpg`
}
