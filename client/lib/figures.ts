// The figures on the hero shelf, in shelf order (left to right, bottom row first).
// Each fate line is short on purpose: it is printed on the book's name plate.
// Every fate below must be re-verified against a source before launch.

export type Figure = {
  slug: string;        // matches the file name in /public/figures
  name: string;        // full name as printed on the plate
  known?: string;      // the name people know them by
  realm: string;       // cartel or kingdom
  fate: string;        // short, printed under the name
};

export const FIGURES: Figure[] = [
  // ---------- bottom row: Medellín and Cali ----------
  { slug: "pablo-escobar", name: "Pablo Escobar", realm: "Medellín", fate: "Killed · 1993" },
  { slug: "gonzalo-rodriguez-gacha", name: "Gonzalo Rodríguez Gacha", known: "El Mexicano", realm: "Medellín", fate: "Killed · 1989" },
  { slug: "carlos-lehder", name: "Carlos Lehder", realm: "Medellín", fate: "Imprisoned · 1987" },
  { slug: "jorge-luis-ochoa", name: "Jorge Luis Ochoa", realm: "Medellín", fate: "Surrendered · 1991" },
  { slug: "gilberto-rodriguez-orejuela", name: "Gilberto Rodríguez Orejuela", known: "The Chess Player", realm: "Cali", fate: "Died in a US prison · 2022" },
  { slug: "miguel-rodriguez-orejuela", name: "Miguel Rodríguez Orejuela", realm: "Cali", fate: "Extradited · 2005" },
  { slug: "helmer-herrera", name: "Hélmer Herrera", known: "Pacho", realm: "Cali", fate: "Killed in prison · 1998" },
  { slug: "jose-santacruz-londono", name: "José Santacruz Londoño", known: "Chepe", realm: "Cali", fate: "Killed · 1996" },
  { slug: "pablo-acosta", name: "Pablo Acosta Villarreal", realm: "Ojinaga", fate: "Killed · 1987" },

  // ---------- top row: Mexico, the Gulf, and the King ----------
  { slug: "miguel-angel-felix-gallardo", name: "Miguel Ángel Félix Gallardo", known: "El Padrino", realm: "Guadalajara", fate: "Imprisoned · 1989" },
  { slug: "rafael-caro-quintero", name: "Rafael Caro Quintero", realm: "Guadalajara", fate: "Sent to the US · 2025" },
  { slug: "ernesto-fonseca-carrillo", name: "Ernesto Fonseca Carrillo", known: "Don Neto", realm: "Guadalajara", fate: "Imprisoned · 1985" },
  { slug: "amado-carrillo-fuentes", name: "Amado Carrillo Fuentes", known: "Lord of the Skies", realm: "Juárez", fate: "Died in surgery · 1997" },
  { slug: "arellano-felix-brothers", name: "The Arellano Félix Brothers", realm: "Tijuana", fate: "Killed and imprisoned" },
  { slug: "juan-garcia-abrego", name: "Juan García Ábrego", realm: "Gulf", fate: "Life sentence · 1996" },
  { slug: "osiel-cardenas-guillen", name: "Osiel Cárdenas Guillén", realm: "Gulf", fate: "Extradited · 2007" },
  { slug: "joaquin-guzman", name: "Joaquín Guzmán", known: "El Chapo", realm: "Sinaloa", fate: "Life sentence · 2019" },
  { slug: "king-solomon", name: "King Solomon", realm: "Israel", fate: "His kingdom split · c. 931 BC" },
];

// How many books sit on the bottom row; the rest go on the top row.
export const BOTTOM_ROW_COUNT = 9;
