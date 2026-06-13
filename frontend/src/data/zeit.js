// Wochentage — Tag 1 ist immer ein Montag.
export const WOCHENTAGE = [
  'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag',
  'Freitag', 'Samstag', 'Sonntag',
]

export function wochentag(tag) {
  return WOCHENTAGE[(tag - 1) % 7]
}
