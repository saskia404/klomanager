// Die 5 Standort-Typen — jeder mit eigener Klientel, eigenen
// Risiken und eigenen Sonderereignissen (siehe game/events.js).
export const STANDORTE = {
  bf: {
    id: 'bf',
    name: 'Bahnhof',
    emoji: '🚉',
    beschreibung: 'Pendler, Reisende, Verspätungen. Hier ist immer ' +
      'irgendwer in Eile und dringend auf dem Weg zum Klo.',
  },
  ks: {
    id: 'ks',
    name: 'Kaserne',
    emoji: '🪖',
    beschreibung: 'Disziplin, Drill, treue Stammkundschaft — aber ' +
      'wenig Sold. Dafür kommt der Amtsarzt hier öfter vorbei.',
  },
  st: {
    id: 'st',
    name: 'Stadion',
    emoji: '🏟️',
    beschreibung: 'An Spieltagen die Hölle los, sonst gähnende Leere. ' +
      'Fans sind großzügig — und manchmal randalierend.',
  },
  fz: {
    id: 'fz',
    name: 'Fußgängerzone',
    emoji: '🛍️',
    beschreibung: 'Shopping, Touristen, Straßenmusik. Zahlungsbereit, ' +
      'aber die Mieten ziehen entsprechend an.',
  },
  fh: {
    id: 'fh',
    name: 'Flughafen',
    emoji: '✈️',
    beschreibung: 'Internationale Gäste mit dicker Reisekasse — und ' +
      'Sicherheitskontrollen, die jeden nervös machen.',
  },
}
