/* The Contents of Investigation I: six parts, thirty laws, approved 5 November 2026.
   Each law names the figure its Transgression opens on. Everyone else appears inside the law.
   The Judgment, the three era stamps and the Key line drop in as each entry is written
   (judgment, eras, key below); the reader shows them as soon as they are filled. */
import type { Part } from "./types";

export const PASS_LINE = "One Series Pass opens every part as it is released.";

export const PARTS: Part[] = [
  {
    n: 1, title: "The Crown and the State", opens: "17 Dec 2026",
    laws: [
      { n: 1, title: "Never Make the State Your Rival", opener: "Jack Ma", place: "Shanghai, 2020" },
      { n: 2, title: "Never Mistake a Title for Power", opener: "Louis XVI", place: "Versailles, 1789" },
      { n: 3, title: "The Law Is Your Wall; Do Not Climb Over It", opener: "Richard Nixon", place: "Watergate, 1972" },
      { n: 4, title: "Do Not Outgrow Your Protectors", opener: "Manuel Noriega", place: "Panama, 1989" },
      { n: 5, title: "What You Buy Can Be Sold Back", opener: "Miguel Ángel Félix Gallardo", place: "Guadalajara, 1989" },
    ],
  },
  {
    n: 2, title: "The Court", opens: "Jan 2027",
    laws: [
      { n: 6, title: "Punish the Messenger and You Will Rule Blind", opener: "Saddam Hussein", place: "Baghdad, 2003" },
      { n: 7, title: "Beware the Favourite Who Owns Your Ear", opener: "Nicholas II and Rasputin", place: "St Petersburg, 1916" },
      { n: 8, title: "Loyalty You Buy Leaves With the Money", opener: "Mobutu Sese Seko", place: "Kinshasa, 1997" },
      { n: 9, title: "Never Let One Man Hold All Your Secrets", opener: "The Rodríguez Orejuela brothers", place: "Cali, 1995" },
      { n: 10, title: "Your Household Is Part of Your Throne", opener: "Ferdinand and Imelda Marcos", place: "Manila, 1986" },
    ],
  },
  {
    n: 3, title: "The Treasury", opens: "Feb 2027",
    laws: [
      { n: 11, title: "Do Not Feast Where the Hungry Can See You", opener: "The Shah of Iran", place: "Persepolis, 1971" },
      { n: 12, title: "Borrowed Strength Breaks All at Once", opener: "Lehman Brothers", place: "New York, 2008" },
      { n: 13, title: "Praise Is Not Proof", opener: "Enron", place: "Houston, 2001" },
      { n: 14, title: "What Hunger Built, Comfort Spends", opener: "The House of Gucci", place: "Milan, 1995" },
      { n: 15, title: "Never Seek the Light With Money Made in the Dark", opener: "Pablo Escobar", place: "Bogotá, 1984" },
    ],
  },
  {
    n: 4, title: "The Sword", opens: "Mar 2027",
    laws: [
      { n: 16, title: "Fear Rules Only Until It Is Tested", opener: "Idi Amin", place: "Kampala, 1979" },
      { n: 17, title: "Never Open a Second Front", opener: "Adolf Hitler", place: "The invasion of Russia, 1941" },
      { n: 18, title: "Terror Unites Your Enemies", opener: "The Arellano Félix brothers", place: "Guadalajara, 1993" },
      { n: 19, title: "Do Not Strike the One the World Is Watching", opener: "Rafael Caro Quintero", place: "Guadalajara, 1985" },
      { n: 20, title: "Every Conquest Has a Border; Find It First", opener: "Napoleon Bonaparte", place: "The river Niemen, 1812" },
    ],
  },
  {
    n: 5, title: "The People", opens: "Apr 2027",
    laws: [
      { n: 21, title: "Hear the Square Before It Shouts", opener: "Nicolae Ceaușescu", place: "Bucharest, 1989" },
      { n: 22, title: "The Story Told About You Outlives the Truth", opener: "Marie Antoinette", place: "Paris, 1793" },
      { n: 23, title: "Never Leave the House While the Ground Is Shaking", opener: "Kwame Nkrumah", place: "Accra, 1966" },
      { n: 24, title: "Change Before the People Change You", opener: "Hosni Mubarak", place: "Tahrir Square, 2011" },
      { n: 25, title: "Never Threaten the Many", opener: "Muammar Gaddafi", place: "Tripoli, 2011" },
    ],
  },
  {
    n: 6, title: "The Succession", opens: "May 2027",
    laws: [
      { n: 26, title: "Leave the Table When the Meal Is Over", opener: "Robert Mugabe", place: "Harare, 2017" },
      { n: 27, title: "Name Your Heir or Your Heirs Will Name Themselves", opener: "Amado Carrillo Fuentes", place: "Mexico City, 1997" },
      { n: 28, title: "Fame Is the Fugitive's Last Mistake", opener: "Joaquín Guzmán, El Chapo", place: "Los Mochis, 2016" },
      { n: 29, title: "Know When Your Season Is Over", opener: "Haile Selassie", place: "Addis Ababa, 1974" },
      { n: 30, title: "Even the Wisest Can Fall", opener: "King Solomon", place: "Jerusalem, tenth century BC" },
    ],
  },
];
