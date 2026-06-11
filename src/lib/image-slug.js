/** Swedish letters → ASCII for image filenames: å→a, ä→a, ö→o */
export function imageFilenameSlug(name) {
  return String(name)
    .trim()
    .replace(/[åäÅÄ]/g, 'a')
    .replace(/[öÖ]/g, 'o')
    .toLowerCase()
    .replace(/\s+/g, '-')
}
