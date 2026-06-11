import { imageFilenameSlug } from './image-slug.js'

/** Portrait filename from guest real name: "Amanda Mungsgård" → amanda-mungsgard.jpg (åä→a, ö→o) */
export function portraitPath(realName) {
  return `/images/portraits/${imageFilenameSlug(realName)}.jpg`
}
