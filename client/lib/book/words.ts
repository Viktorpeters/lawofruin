/* Word cards: foreign words, ideas, book terms and places. Bundled with the app, so they open offline.
   WORDS maps the exact text in the book to its card. */
import type { Word } from "./types";

export const WORD_CARDS: Word[] = [
  // ---- foreign words and ideas
  { id: "mamluk", word: "Mamluk", say: "MAM-look", tag: "Arabic · Noun", meaning: "A soldier bought as a slave and trained for war. Mamluks became a ruling class and governed Egypt and Syria from 1250 to 1517.", use: "The young Mamluk sultan of Egypt, Faraj, had marched north." },
  { id: "quran", word: "Quran", say: "kuh-RAHN", tag: "Arabic · Noun", meaning: "The holy book of Islam." },
  { id: "asabiyyah", word: "asabiyyah", say: "ah-sah-BEE-yah", tag: "Arabic · Idea", meaning: "Group feeling: the bond of loyalty and shared hardship that lets a people win power. Ibn Khaldun taught that comfort slowly dissolves it.", use: "He called that bond asabiyyah." },
  { id: "muqaddimah", word: "Muqaddimah", say: "moo-KAH-dee-mah", tag: "Arabic · Title", meaning: "“The Introduction”: Ibn Khaldun's 1377 work on how societies and dynasties rise and fall." },
  { id: "mandate-of-heaven", word: "Mandate of Heaven", tag: "Chinese · Idea", meaning: "The ancient Chinese belief that a dynasty rules only while it rules well, and loses heaven's favour when it grows corrupt." },
  { id: "hubris", word: "hubris", say: "HYOO-bris", tag: "Greek · Noun", meaning: "Pride and overconfidence that lead a person to their fall.", use: "He called it hubris syndrome." },
  { id: "guillotine", word: "guillotine", say: "GIL-uh-teen", tag: "French · Noun", meaning: "The tall blade machine used for executions during the French Revolution." },
  { id: "great-leap-forward", word: "Great Leap Forward", tag: "History · 1958 to 1962", meaning: "Mao Zedong's campaign to turn China into an industrial power at speed. False harvest reports and forced quotas led to one of the worst famines in history." },
  { id: "chapter-11", word: "Chapter 11", tag: "Law · United States", meaning: "The part of American law under which a company in trouble asks a court for protection from its creditors while it reorganises." },
  { id: "ecclesiastes", word: "Ecclesiastes", say: "ih-klee-zee-AS-teez", tag: "Book of the Bible", meaning: "A book of the Bible, traditionally linked to King Solomon, on how little of what we chase in life lasts." },
  { id: "vanity", word: "vanity", tag: "Old English sense", meaning: "Here it means emptiness, something that passes like a breath. Not pride in one's looks.", use: "Vanity of vanities; all is vanity." },
  { id: "excos", word: "excos", say: "EK-sohz", tag: "Nigerian English · Noun", meaning: "Short for executive council members: the elected officers who served under me." },
  { id: "mini-defence", word: "mini defence", tag: "Nigerian English · Noun", meaning: "An early presentation of a final year project before a panel of lecturers, ahead of the final defence." },
  { id: "service-year", word: "service year", tag: "Nigerian English · Noun", meaning: "The one-year National Youth Service Corps programme every Nigerian graduate must complete." },

  // ---- the book's own terms
  { id: "judgment", word: "Judgment", tag: "In this book · Section", meaning: "The verdict on a law, in one sentence." },
  { id: "transgression", word: "Transgression", tag: "In this book · Section", meaning: "The main story of each law: someone who broke it, and what it cost them." },
  { id: "observance", word: "Observance", tag: "In this book · Section", meaning: "The story of someone who kept the law, and survived." },
  { id: "reversal", word: "Reversal", tag: "In this book · Section", meaning: "When the law does not apply. Every law has an edge." },
  { id: "the-record", word: "The Record", tag: "In this book · Section", meaning: "What is verified and what is disputed, each with its numbered source." },

  // ---- places, books and things
  { id: "damascus", word: "Damascus", tag: "Place · Syria", meaning: "One of the oldest cities on earth, now the capital of Syria. Timur besieged and sacked it in 1400 to 1401." },
  { id: "cairo", word: "Cairo", tag: "Place · Egypt", meaning: "Capital of Egypt, and in 1401 the seat of the Mamluk sultans." },
  { id: "tunis", word: "Tunis", tag: "Place · Tunisia", meaning: "City on the coast of North Africa where Ibn Khaldun was born in 1332." },
  { id: "golden-horde", word: "Golden Horde", tag: "History · Empire", meaning: "The Mongol state that ruled the steppes north of the Black and Caspian Seas. Timur broke its power in the 1390s." },
  { id: "delhi", word: "Delhi", tag: "Place · India", meaning: "Capital of the Delhi Sultanate. Timur sacked it in December 1398." },
  { id: "persia", word: "Persia", tag: "Place · Iran", meaning: "The old name for Iran and its empires." },
  { id: "umayyad-mosque", word: "Umayyad Mosque", tag: "Place · Damascus", meaning: "The great mosque of Damascus, built in the early 700s and set on fire when Timur sacked the city." },
  { id: "lushan", word: "Lushan", tag: "Place · China", meaning: "Mountain resort where the Communist Party met in July 1959, and where Peng Dehuai was purged." },
  { id: "bucharest", word: "Bucharest", tag: "Place · Romania", meaning: "Capital of Romania, where Ceaușescu's last rally turned against him on 21 December 1989." },
  { id: "tahrir-square", word: "Tahrir Square", tag: "Place · Cairo", meaning: "Cairo's central square. Its name means Liberation. The centre of the 2011 protests that ended Mubarak's rule." },
  { id: "florence", word: "Florence", tag: "Place · Italy", meaning: "City in Tuscany where Guccio Gucci opened his shop in 1921, and where Machiavelli served." },
  { id: "milan", word: "Milan", tag: "Place · Italy", meaning: "Italy's fashion and business capital, where Maurizio Gucci was killed in 1995." },
  { id: "montgomery", word: "Montgomery", tag: "Place · Alabama, United States", meaning: "Where the three Lehman brothers kept their first store in the 1840s and 1850s." },
  { id: "medellin", word: "Medellín", say: "meh-deh-YEEN", tag: "Place · Colombia", meaning: "Colombia's second city, home of Pablo Escobar's cartel." },
  { id: "berlin", word: "Berlin", tag: "Place · Germany", meaning: "Capital of Germany, where Hitler died in his bunker as the Red Army fought through the streets in 1945." },
  { id: "vienna", word: "Vienna", tag: "Place · Austria", meaning: "Where the young Hitler lived as a failed painter, partly in a men's hostel, from 1908 to 1913." },
  { id: "zimbabwe", word: "Zimbabwe", tag: "Place · Southern Africa", meaning: "Independent since April 1980. Before that, the British colony and then the breakaway state of Rhodesia." },
  { id: "rhodesia", word: "Rhodesia", tag: "History · Southern Africa", meaning: "The name of the country that became Zimbabwe, ruled by a white minority government until 1979." },
  { id: "sirte", word: "Sirte", tag: "Place · Libya", meaning: "Gaddafi's home town on the Libyan coast, where he was found and killed in October 2011." },
  { id: "libya", word: "Libya", tag: "Place · North Africa", meaning: "Ruled by Muammar Gaddafi from 1969 to 2011." },
  { id: "shanghai", word: "Shanghai", tag: "Place · China", meaning: "China's financial capital, where Jack Ma gave his speech at the Bund Summit on 24 October 2020." },
  { id: "niemen", word: "Niemen", say: "NYEH-men", tag: "Place · River", meaning: "The river Napoleon's army crossed into Russia on 24 June 1812." },
  { id: "watergate", word: "Watergate", tag: "Place · Washington", meaning: "The building where burglars linked to Nixon's re-election campaign were caught in June 1972. The name became the scandal." },
  { id: "ekiti", word: "Ekiti", tag: "Place · Nigeria", meaning: "A state in south-west Nigeria. Its capital is Ado-Ekiti." },
  { id: "fortune", word: "Fortune", tag: "Magazine · United States", meaning: "American business magazine, known for its yearly lists of the largest and most admired companies." },
  { id: "heritage-usa", word: "Heritage USA", tag: "Place · South Carolina", meaning: "PTL's Christian theme park, opened in 1978 and once among the most visited in the United States." },
  { id: "king-lear", word: "King Lear", tag: "Play · c. 1606", meaning: "Shakespeare's tragedy of an old king who divides his kingdom among the daughters who flatter him." },
  { id: "cordelia", word: "Cordelia", tag: "Character · King Lear", meaning: "Lear's youngest daughter, the only one who loves him, and the only one who will not flatter him." },
  { id: "the-48-laws", word: "The 48 Laws of Power", tag: "Book · 1998", meaning: "Robert Greene's best-known book on how power is won." },
];

export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORD_CARDS.map((w) => [w.id, w]));

export const WORDS: Record<string, string> = {
  "Mamluk": "mamluk", "Quran": "quran", "asabiyyah": "asabiyyah", "Muqaddimah": "muqaddimah",
  "Mandate of Heaven": "mandate-of-heaven", "hubris": "hubris", "guillotine": "guillotine",
  "Great Leap Forward": "great-leap-forward", "Chapter 11": "chapter-11",
  "Ecclesiastes": "ecclesiastes", "vanity": "vanity", "excos": "excos", "mini defence": "mini-defence", "service year": "service-year",
  "Judgment": "judgment", "Transgression": "transgression", "Observance": "observance", "Reversal": "reversal", "The Record": "the-record",
  "Damascus": "damascus", "Cairo": "cairo", "Tunis": "tunis", "Golden Horde": "golden-horde", "Delhi": "delhi", "Persia": "persia",
  "Umayyad Mosque": "umayyad-mosque", "Lushan": "lushan", "Bucharest": "bucharest", "Tahrir Square": "tahrir-square",
  "Florence": "florence", "Milan": "milan", "Montgomery": "montgomery", "Medellín": "medellin", "Berlin": "berlin", "Vienna": "vienna",
  "Zimbabwe": "zimbabwe", "Rhodesia": "rhodesia", "Sirte": "sirte", "Libya": "libya", "Shanghai": "shanghai", "Niemen": "niemen",
  "Watergate": "watergate", "Ekiti": "ekiti", "Fortune": "fortune", "Heritage USA": "heritage-usa", "King Lear": "king-lear",
  "Cordelia": "cordelia", "The 48 Laws of Power": "the-48-laws",
};
