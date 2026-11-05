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
      {
        n: 1, title: "Never Make the State Your Rival", opener: "Jack Ma", place: "Shanghai, 2020",
        judgment: "However large you grow, the state can grow larger in a single afternoon. Make it your partner, never your audience.",
        eras: ["Bourges, 1451", "Moscow, 2003", "Shanghai, 2020"],
        story: "On 24 October 2020, Jack Ma stood before China's most senior financial officials in Shanghai and told them their banks still had a pawnshop mentality. Ten days later the largest stock listing the world had ever seen, his Ant Group's, was stopped two days before it opened. Then the most celebrated businessman in China vanished from public view for almost three months. He had broken no law. He had made the state look small, in public, in its own house.",
        key: "Seeking: grow inside the state's interest, and let its officials take the credit. Keeping: the larger you become, the quieter you must speak.",
        sections: [
          { name: "The Law", text: "Never make the state your rival. Not in public, not in private, not in a joke. Every company, church, gang and movement lives on ground the state can take back. The state does not need to be right to destroy you. It only needs to be challenged where others can see it." },
          { name: "Judgment", text: "However large you grow, the state can grow larger in a single afternoon. It writes the rules, it holds the courts, and it decides what counts as a crime. Make it your partner, never your audience. The moment it feels like your audience, it stops being your partner." },
          { name: "Transgression", text: "Shanghai, 24 October 2020. Jack Ma, the English teacher who built Alibaba out of his flat in 1999, steps onto the stage at the Bund Summit. Seated in front of him are the men who regulate China's money. He calls their rules outdated and their banks pawnshops. Ant Group is days away from raising about $34.5 billion, the largest listing in history. On 3 November it is suspended. By April 2021 Alibaba is fined 18.2 billion yuan, about $2.8 billion. Ma disappears from view until a short video in January, and in 2023 he gives up control of Ant." },
          { name: "Observance", text: "Augsburg, 1519. Jakob Fugger is the richest man in Europe, richer than the kings he lends to. When the throne of the Holy Roman Empire falls vacant, he puts up most of the money that buys the election for the young Charles V. He grows rich beyond anyone's measure, yet he never lets a prince feel smaller than him in public. He made himself necessary, never a threat. He died in his bed in 1525, his fortune and his name intact." },
          { name: "Interpretation", text: "A state is not a company. It does not compete with you on price or quality. It competes on survival, and it treats public humiliation as an attack on its survival. Jack Ma made an argument any banker might make. His mistake was where he made it, who was listening, and how large he had become. A small man criticising the state is a critic. A man larger than its banks criticising it is a rival. Rivals are not answered. They are removed." },
          { name: "Parallels", text: "Bourges, 1451: Jacques Coeur, the richest merchant in France, lends Charles VII the money to win back Normandy, and is arrested on charges no one believes; his fortune passes to the king's men. Moscow, 2003: Mikhail Khodorkovsky, the richest man in Russia, accuses officials of corruption to Vladimir Putin's face on live television in February; by October he is arrested on his plane in Siberia, and his company, Yukos, is broken up. Medellín, 1984 to 1993: Pablo Escobar declares open war on the Colombian state to stop his extradition, and the state, with help from abroad, hunts him to a rooftop." },
          { name: "The Cost", text: "For Ma: the listing that would have made Ant one of the most valuable financial companies on earth, gone; a record fine; control of the company he built; years of silence; and hundreds of billions of dollars wiped off Alibaba's value. For Coeur: everything he owned and his freedom. For Khodorkovsky: ten years in prison and his company. For Escobar: his life. The price rises with how openly the state was defied." },
          { name: "The Record", text: "Verified: the speech of 24 October 2020, its words, and the suspension of the listing on 3 November; the fine of April 2021; Ma's step back from control of Ant in 2023. Disputed: whether Ma was held or questioned during his months out of view. No public evidence shows he was detained, and he has never said. Where this book does not know, it says so." },
          { name: "Keys", text: "For those seeking: grow inside the state's interest. Solve a problem officials care about, and let them stand in the photograph. For those keeping: the larger you become, the quieter you must speak. Raise disagreements in private rooms, through the right people, and never let a ruler learn of your criticism from the news." },
          { name: "Image", text: "The tree beside the palace wall. Let it grow tall and give shade, and the king will rest under it. Let it grow taller than the wall and block his view, and it is cut down, however healthy it is." },
          { name: "Authority", text: "\u201cA tall tree catches the wind.\u201d An old Chinese saying, older than any company in this book. And from Ibn Khaldun, in the Muqaddimah: royal power, by its nature, claims all the glory for itself, and turns on whoever seems to share it." },
          { name: "Reversal", text: "The law bends when the state itself is dying. When a government is too weak to collect its taxes or pay its soldiers, those who defy it may become the next government, as many founders of dynasties did. But the reversal is a gamble on the state's death. Until it is certainly dying, it is still the largest power in the room." },
        ],
      },
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
