// Every volume on the shelf.
// slug: matches the photo name in /public/figures (slug.jpg).
// born / died: years shown on the cover's name plate. No "died" means the person is alive.
// span: used instead of born and died when the volume is a group (the Arellano Félix brothers).
// focus: where the face sits in the photo ("x% y%"), default "50% 28%".
// Every date and fate below must be checked against a source again before launch.

export type Circle = "cartel" | "throne" | "soldier" | "ancient";

export type Figure = {
  slug: string;
  name: string;
  known?: string;
  realm: string;
  circle: Circle;
  born?: string;
  died?: string;
  span?: string;
  fate: string;
  focus?: string;
};

export const CIRCLE_NAME: Record<Circle, string> = {
  cartel: "The Cartels",
  throne: "The Thrones",
  soldier: "The Soldiers",
  ancient: "The Ancients",
};

export const FIGURES: Figure[] = [
  // ---------- the cartels ----------
  { slug: "pablo-escobar", name: "Pablo Escobar", realm: "Medellín", circle: "cartel", born: "1949", died: "1993", fate: "Killed · 1993" },
  { slug: "gonzalo-rodriguez-gacha", name: "Gonzalo Rodríguez Gacha", known: "El Mexicano", realm: "Medellín", circle: "cartel", born: "1947", died: "1989", fate: "Killed · 1989" },
  { slug: "carlos-lehder", name: "Carlos Lehder", realm: "Medellín", circle: "cartel", born: "1949", fate: "Captured · 1987" },
  { slug: "jorge-luis-ochoa", name: "Jorge Luis Ochoa", realm: "Medellín", circle: "cartel", born: "1950", fate: "Surrendered · 1991" },
  { slug: "gilberto-rodriguez-orejuela", name: "Gilberto Rodríguez Orejuela", known: "The Chess Player", realm: "Cali", circle: "cartel", born: "1939", died: "2022", fate: "Died in a US prison · 2022" },
  { slug: "miguel-rodriguez-orejuela", name: "Miguel Rodríguez Orejuela", realm: "Cali", circle: "cartel", born: "1943", fate: "Extradited · 2005" },
  { slug: "helmer-herrera", name: "Hélmer Herrera", known: "Pacho", realm: "Cali", circle: "cartel", born: "1951", died: "1998", fate: "Killed in prison · 1998" },
  { slug: "jose-santacruz-londono", name: "José Santacruz Londoño", known: "Chepe", realm: "Cali", circle: "cartel", born: "1943", died: "1996", fate: "Killed · 1996" },
  { slug: "pablo-acosta", name: "Pablo Acosta Villarreal", realm: "Ojinaga", circle: "cartel", born: "1937", died: "1987", fate: "Killed · 1987" },
  { slug: "miguel-angel-felix-gallardo", name: "Miguel Ángel Félix Gallardo", known: "El Padrino", realm: "Guadalajara", circle: "cartel", born: "1946", fate: "Imprisoned · 1989" },
  { slug: "rafael-caro-quintero", name: "Rafael Caro Quintero", realm: "Guadalajara", circle: "cartel", born: "1952", fate: "Sent to the US · 2025" },
  { slug: "ernesto-fonseca-carrillo", name: "Ernesto Fonseca Carrillo", known: "Don Neto", realm: "Guadalajara", circle: "cartel", born: "1930", fate: "Imprisoned · 1985" },
  { slug: "amado-carrillo-fuentes", name: "Amado Carrillo Fuentes", known: "Lord of the Skies", realm: "Juárez", circle: "cartel", born: "1956", died: "1997", fate: "Died in surgery · 1997" },
  { slug: "arellano-felix-brothers", name: "The Arellano Félix Brothers", realm: "Tijuana", circle: "cartel", span: "1989 to 2006", fate: "Killed and imprisoned" },
  { slug: "juan-garcia-abrego", name: "Juan García Ábrego", realm: "Gulf", circle: "cartel", born: "1944", fate: "Life sentence · 1996" },
  { slug: "osiel-cardenas-guillen", name: "Osiel Cárdenas Guillén", realm: "Gulf", circle: "cartel", born: "1967", fate: "Extradited · 2007" },
  { slug: "joaquin-guzman", name: "Joaquín Guzmán", known: "El Chapo", realm: "Sinaloa", circle: "cartel", born: "1957", fate: "Life sentence · 2019" },

  // ---------- the ancients ----------
  { slug: "king-solomon", name: "King Solomon", realm: "Israel", circle: "ancient", span: "c. 970 to 931 BC", fate: "His kingdom split · c. 931 BC", focus: "50% 22%" },

  // ---------- the thrones ----------
  { slug: "louis-xvi", name: "Louis XVI", realm: "France", circle: "throne", born: "1754", died: "1793", fate: "Guillotined · 1793" },
  { slug: "marie-antoinette", name: "Marie Antoinette", realm: "France", circle: "throne", born: "1755", died: "1793", fate: "Guillotined · 1793" },
  { slug: "napoleon-bonaparte", name: "Napoleon Bonaparte", realm: "France", circle: "throne", born: "1769", died: "1821", fate: "Exiled · 1815" },
  { slug: "shaka-zulu", name: "Shaka Zulu", realm: "Zulu Kingdom", circle: "throne", born: "c. 1787", died: "1828", fate: "Assassinated · 1828" },
  { slug: "maximilian-i-mexico", name: "Maximilian I", known: "Emperor of Mexico", realm: "Mexico", circle: "throne", born: "1832", died: "1867", fate: "Executed · 1867" },
  { slug: "tewodros-ii", name: "Tewodros II", realm: "Ethiopia", circle: "throne", born: "1818", died: "1868", fate: "Fell at Magdala · 1868" },
  { slug: "napoleon-iii", name: "Napoleon III", realm: "France", circle: "throne", born: "1808", died: "1873", fate: "Deposed · 1870" },
  { slug: "nicholas-ii", name: "Nicholas II", realm: "Russia", circle: "throne", born: "1868", died: "1918", fate: "Executed · 1918" },
  { slug: "wilhelm-ii", name: "Wilhelm II", realm: "Germany", circle: "throne", born: "1859", died: "1941", fate: "Abdicated · 1918" },
  { slug: "adolf-hitler", name: "Adolf Hitler", realm: "Germany", circle: "throne", born: "1889", died: "1945", fate: "Died in his bunker · 1945" },
  { slug: "benito-mussolini", name: "Benito Mussolini", realm: "Italy", circle: "throne", born: "1883", died: "1945", fate: "Executed · 1945" },
  { slug: "fulgencio-batista", name: "Fulgencio Batista", realm: "Cuba", circle: "throne", born: "1901", died: "1973", fate: "Fled Cuba · 1959" },
  { slug: "kwame-nkrumah", name: "Kwame Nkrumah", realm: "Ghana", circle: "throne", born: "1909", died: "1972", fate: "Overthrown · 1966" },
  { slug: "richard-nixon", name: "Richard Nixon", realm: "United States", circle: "throne", born: "1913", died: "1994", fate: "Resigned · 1974" },
  { slug: "haile-selassie", name: "Haile Selassie", realm: "Ethiopia", circle: "throne", born: "1892", died: "1975", fate: "Deposed · 1974" },
  { slug: "mohammad-reza-pahlavi", name: "Mohammad Reza Pahlavi", known: "The Shah", realm: "Iran", circle: "throne", born: "1919", died: "1980", fate: "Fled Iran · 1979" },
  { slug: "idi-amin", name: "Idi Amin", realm: "Uganda", circle: "throne", born: "c. 1925", died: "2003", fate: "Fled Uganda · 1979" },
  { slug: "jean-bedel-bokassa", name: "Jean-Bédel Bokassa", known: "Emperor Bokassa I", realm: "Central Africa", circle: "throne", born: "1921", died: "1996", fate: "Overthrown · 1979" },
  { slug: "ferdinand-marcos", name: "Ferdinand Marcos", realm: "Philippines", circle: "throne", born: "1917", died: "1989", fate: "Fled Manila · 1986" },
  { slug: "nicolae-ceausescu", name: "Nicolae Ceaușescu", realm: "Romania", circle: "throne", born: "1918", died: "1989", fate: "Executed · 1989" },
  { slug: "manuel-noriega", name: "Manuel Noriega", realm: "Panama", circle: "throne", born: "1934", died: "2017", fate: "Surrendered · 1990" },
  { slug: "samuel-doe", name: "Samuel Doe", realm: "Liberia", circle: "throne", born: "1951", died: "1990", fate: "Killed · 1990" },
  { slug: "mobutu-sese-seko", name: "Mobutu Sese Seko", realm: "Zaire", circle: "throne", born: "1930", died: "1997", fate: "Overthrown · 1997" },
  { slug: "pol-pot", name: "Pol Pot", realm: "Cambodia", circle: "throne", born: "1925", died: "1998", fate: "Died a prisoner · 1998" },
  { slug: "augusto-pinochet", name: "Augusto Pinochet", realm: "Chile", circle: "throne", born: "1915", died: "2006", fate: "Arrested in London · 1998" },
  { slug: "slobodan-milosevic", name: "Slobodan Milošević", realm: "Serbia", circle: "throne", born: "1941", died: "2006", fate: "Died on trial · 2006" },
  { slug: "saddam-hussein", name: "Saddam Hussein", realm: "Iraq", circle: "throne", born: "1937", died: "2006", fate: "Executed · 2006" },
  { slug: "muammar-gaddafi", name: "Muammar Gaddafi", realm: "Libya", circle: "throne", born: "1942", died: "2011", fate: "Killed · 2011" },
  { slug: "hosni-mubarak", name: "Hosni Mubarak", realm: "Egypt", circle: "throne", born: "1928", died: "2020", fate: "Overthrown · 2011" },
  { slug: "charles-taylor", name: "Charles Taylor", realm: "Liberia", circle: "throne", born: "1948", fate: "Sentenced · 2012" },
  { slug: "robert-mugabe", name: "Robert Mugabe", realm: "Zimbabwe", circle: "throne", born: "1924", died: "2019", fate: "Ousted · 2017" },
  { slug: "omar-al-bashir", name: "Omar al-Bashir", realm: "Sudan", circle: "throne", born: "1944", fate: "Overthrown · 2019" },

  // ---------- the soldiers: Nigeria ----------
  { slug: "chukwuma-nzeogwu", name: "Chukwuma Kaduna Nzeogwu", known: "Major Nzeogwu", realm: "Nigeria", circle: "soldier", born: "1937", died: "1967", fate: "Killed in battle · 1967" },
  { slug: "johnson-aguiyi-ironsi", name: "Johnson Aguiyi-Ironsi", realm: "Nigeria", circle: "soldier", born: "1924", died: "1966", fate: "Killed in a coup · 1966" },
  { slug: "murtala-mohammed", name: "Murtala Mohammed", realm: "Nigeria", circle: "soldier", born: "1938", died: "1976", fate: "Assassinated · 1976" },
  { slug: "buka-suka-dimka", name: "Buka Suka Dimka", realm: "Nigeria", circle: "soldier", born: "c. 1940", died: "1976", fate: "Executed · 1976" },
  { slug: "gideon-orkar", name: "Gideon Orkar", realm: "Nigeria", circle: "soldier", born: "1952", died: "1990", fate: "Executed · 1990" },
  { slug: "sani-abacha", name: "Sani Abacha", realm: "Nigeria", circle: "soldier", born: "1943", died: "1998", fate: "Died in office · 1998" },
];

export const BY_SLUG: Record<string, Figure> = Object.fromEntries(FIGURES.map((f) => [f.slug, f]));

// The order the covers stand in, mixed by hand so the shelves read as one story of power,
// not a catalogue. Strong, famous faces come first, where the eye lands.
export const SHELVES: [string[], string[]] = [
  [
    "adolf-hitler", "pablo-escobar", "muammar-gaddafi", "napoleon-bonaparte", "miguel-angel-felix-gallardo",
    "idi-amin", "chukwuma-nzeogwu", "benito-mussolini", "amado-carrillo-fuentes", "king-solomon",
    "pol-pot", "louis-xvi", "gonzalo-rodriguez-gacha", "mohammad-reza-pahlavi", "robert-mugabe",
    "marie-antoinette", "jorge-luis-ochoa", "richard-nixon", "buka-suka-dimka", "augusto-pinochet",
    "miguel-rodriguez-orejuela", "kwame-nkrumah", "jose-santacruz-londono", "gideon-orkar", "maximilian-i-mexico",
    "ernesto-fonseca-carrillo", "napoleon-iii", "pablo-acosta",
  ],
  [
    "saddam-hussein", "joaquin-guzman", "mobutu-sese-seko", "murtala-mohammed", "nicolae-ceausescu",
    "gilberto-rodriguez-orejuela", "nicholas-ii", "sani-abacha", "ferdinand-marcos", "rafael-caro-quintero",
    "samuel-doe", "carlos-lehder", "johnson-aguiyi-ironsi", "manuel-noriega", "helmer-herrera",
    "haile-selassie", "slobodan-milosevic", "shaka-zulu", "arellano-felix-brothers", "jean-bedel-bokassa",
    "wilhelm-ii", "charles-taylor", "juan-garcia-abrego", "fulgencio-batista", "hosni-mubarak",
    "osiel-cardenas-guillen", "tewodros-ii", "omar-al-bashir",
  ],
];

// The two ends of the name plate's date line: ["1949", "1993"], ["1957", null] for the living,
// or [span, null] for a group.
export function dates(f: Figure): [string, string | null] {
  if (f.span) return [f.span, null];
  return [f.born ?? "", f.died ?? null];
}
