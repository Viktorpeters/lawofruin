/* The Contents of Investigation I: six parts, thirty laws, approved 5 November 2026.
   Each law names the figure its Transgression opens on. Everyone else appears inside the law.
   The Judgment, the three era stamps and the Key line drop in as each entry is written
   (judgment, eras, key below); the reader shows them as soon as they are filled. */
import type { Part } from "./types";

export const PASS_LINE = "One Series Pass opens every part as it is released.";

export const PARTS: Part[] = [
  {
    n: 1, title: "The Crown and the State", opens: "17 Dec 2026",
    line: "How the powerful collide with the one power larger than them all.",
    laws: [
      {
        n: 1, title: "Never Make the State Your Rival", opener: "Jack Ma", place: "Shanghai, 2020",
        judgment: "However large you grow, the state can grow larger in a single afternoon. Make it your partner, never your audience.",
        eras: ["Paris, 1307", "Moscow, 2003", "Shanghai, 2020"],
        story: "On 24 October 2020, Jack Ma stood before China's most senior financial officials in Shanghai and told them their banks still had a pawnshop mentality. Ten days later the largest stock listing the world had ever seen, his Ant Group's, was stopped two days before it opened. Then the most celebrated businessman in China vanished from public view for almost three months. He had broken no law. He had made the state look small, in public, in its own house.",
        key: "Seeking: grow inside the state's interest, and let its officials take the credit. Keeping: the larger you become, the quieter you must speak.",
        sections: [
          { name: "The Law", text: "Never make the state your rival. Not in public, not in private, not in a joke. Every company, church, gang and movement stands on ground the state can take back, and the state does not need to be right to take it. On Friday, 13 October 1307, before dawn, the officers of Philip IV of France opened sealed orders in every town of the kingdom and arrested the Knights Templar, the richest order in Christendom, its bankers, its lenders, its knights. The king owed them money. Within five years Pope Clement V dissolved the order. On 18 March 1314 its last Grand Master, Jacques de Molay, was burned alive on an island in the Seine. The Templars had broken no law the king could not invent. Their crime was being a power the crown could not command, holding money the crown needed. The law is older than any of us: grow as large as you like, but never so large, so loud or so independent that the state must prove it is still the master." },
          { name: "Judgment", text: "However large you grow, the state can grow larger in a single afternoon. It writes the rules, it holds the courts, it prints the money and it decides what counts as a crime. On 30 June 2021 the Chinese ride-hailing giant Didi raised $4.4 billion on the New York Stock Exchange, against the quiet wishes of its own regulators. Two days later, on 2 July, the Cyberspace Administration of China opened a security review. Two days after that, Didi's app was ordered off every app store in China. Within a year Didi announced it would leave the New York exchange altogether. No court case, no trial, no warning. Make the state your partner, never your audience. The moment it feels like your audience, it stops being your partner." },
          { name: "Transgression", text: "Shanghai, Saturday 24 October 2020. Jack Ma, the former English teacher who started Alibaba with seventeen friends in his flat in Hangzhou in 1999, walks onto the stage of the Bund Summit. Alibaba's 2014 listing in New York had raised $25 billion, then the largest in history. Now his payments company, Ant Group, is days from raising about $34.5 billion in Shanghai and Hong Kong, a new record, at a value near $313 billion. In the audience sit the men who run China's money, with Vice President Wang Qishan among the speakers. Ma tells them the global banking rules, the Basel Accords, are a club for old men, and that China's banks still have a pawnshop mentality. The speech is reported nationwide within hours. On 2 November Ma is summoned to a joint meeting with four regulators. On 3 November the Shanghai exchange suspends Ant's listing, two days before trading was due to begin. In December regulators open an antitrust investigation into Alibaba. On 10 April 2021 it is fined 18.2 billion yuan, about $2.8 billion, a Chinese record. Ma is not seen in public until a short video for rural teachers on 20 January 2021. In January 2023 Ant announces he has given up control of the company he built." },
          { name: "Observance", text: "Augsburg, 1519. Jakob Fugger, a weaver's grandson, is the richest man in Europe, richer than the kings who borrow from him. When the Holy Roman Emperor Maximilian dies, the princes who choose his successor are for sale. Fugger lends most of the roughly 850,000 florins that buy the election for the nineteen-year-old Charles V. Four years later the emperor has still not repaid him. Fugger does not complain at court or to the crowd. He writes a private, courteous letter reminding Charles that without him the crown could not have been won, and asks only to be paid. He is paid, in mining rights and revenues. He dies in his bed on 30 December 1525, perhaps the richest man who has ever lived. Four centuries later, in November 1907, a run on New York's trust companies threatens to bring down American banking. J. P. Morgan locks the city's bankers inside his library until they agree to put up the money to stop it. He acts, in private rooms, as the state's partner, and leaves the credit to the Treasury. He dies in 1913 rich and untouched. Both men were larger than the rulers of their day in money. Neither ever let a ruler feel it in public." },
          { name: "Interpretation", text: "A state is not a company. It does not compete with you on price or quality. It competes on survival, and it reads public humiliation as an attack on its survival. Jack Ma made an argument any banker might make. His mistake was where he made it, who was listening, and how large he had become when he made it. A small man who criticises the state is a critic. A man whose company is larger than the state's own banks, criticising it from a stage, is a rival. China had spent 2020 warning of financial risk, and Ant lent to hundreds of millions of people with less capital held back than any bank was allowed. The state did not need to win the argument. It needed to show who decides. Ibn Khaldun saw it six centuries earlier: royal power, by its nature, claims all the glory for itself. Whatever seems to share the glory must be brought down, not because it is wrong, but because it is there." },
          { name: "Parallels", text: "Bourges, 1451. Jacques Coeur, the richest merchant in France, lends Charles VII the money to drive the English out of Normandy. In July 1451 he is arrested on charges that include poisoning the king's mistress, which no one seriously believed. His fortune is seized and shared among the courtiers who owed him money. He escapes to Rome and dies in 1456 on the island of Chios, leading a papal fleet. Tokyo, 2006. Takafumi Horie, the young founder of the internet company Livedoor, has spent a year openly defying Japan's business establishment, trying to buy his way into a national broadcaster. On 23 January 2006 prosecutors arrest him for securities fraud. He serves almost two years in prison. Moscow, 2003. On 19 February, on live television, Mikhail Khodorkovsky, the richest man in Russia, accuses officials of corruption to Vladimir Putin's face. On 25 October armed agents board his plane on the runway at Novosibirsk. He spends ten years in prison; his oil company, Yukos, is broken up and its best field is sold to the state. Medellín, 1984 to 1993. Pablo Escobar has his men kill the justice minister, Rodrigo Lara Bonilla, who exposed him, then declares war on the Colombian state to stop his extradition. He bombs, kidnaps and bribes for nine years. On 2 December 1993 the state, with help from abroad, kills him on a Medellín rooftop." },
          { name: "The Cost", text: "For Ma: a listing that would have made Ant one of the most valuable financial companies on earth, gone; the largest antitrust fine in China's history; control of his life's work; and more than half of Alibaba's value, hundreds of billions of dollars, wiped away in the two years after the speech. For the Templars: their order, their wealth and, for de Molay, his life. For Coeur: everything he owned and his country. For Horie: his company, two years and his name. For Khodorkovsky: ten years of his life and the largest oil company in Russia. For Escobar: his life, and those of thousands of Colombians. Notice the scale. The price is never measured by the crime. It is measured by how openly the state was defied." },
          { name: "The Record", text: "Verified: the speech of 24 October 2020 and its words, which were reported in full; the summons of 2 November; the suspension of the listing on 3 November 2020; the fine of 10 April 2021; Ma's reduced control of Ant announced in January 2023. Reported but not confirmed: that President Xi Jinping personally ordered the listing stopped, as The Wall Street Journal reported in November 2020; the Chinese government has never said so. Disputed: whether Ma was held or questioned during his months out of view. No public evidence shows he was detained, and he has never said. Where this book does not know, it says so." },
          { name: "Keys", text: "For those seeking: first, grow inside the state's interest; solve a problem officials care about, and let them stand in the photograph. Second, learn which regulator could close you tomorrow, and know that person's name. Third, never take a public stage in a country whose rules you plan to break. For those keeping: first, the larger you become, the quieter you must speak. Second, raise disagreements in private rooms, through the right people, as Fugger did with a courteous letter, never through the news. Third, when you are larger than the state's own institutions in any one area, assume you are already being watched, and act as its partner before it decides you are its rival." },
          { name: "Image", text: "The tree beside the palace wall. Let it grow tall and give shade, and the king will rest beneath it in summer and boast of it to his guests. Let it grow taller than the wall, so that its branches block the king's view of his own city, and it is cut down in a single morning, however healthy its roots, however sweet its fruit. No one asks the tree what it meant." },
          { name: "Authority", text: "“A tall tree catches the wind.” An old Chinese saying, centuries older than any company in this book. “He who is the cause of another becoming powerful is ruined.” Niccolò Machiavelli, The Prince, 1513, written as if for Jacques Coeur, who made his king strong and was destroyed by him. And Ibn Khaldun, in the Muqaddimah of 1377: royal power, by its nature, claims all the glory for itself." },
          { name: "Reversal", text: "The law bends only when the state itself is dying. In 1351 the Mongol Yuan dynasty in China was rotting from famine, floods and corruption. Rebels rose everywhere, and a former beggar monk named Zhu Yuanzhang defied it openly, fought for sixteen years, and in 1368 made himself the first emperor of the Ming. In August 1980 a shipyard electrician named Lech Wałęsa led a strike in Gdańsk that openly defied Poland's communist state. He was arrested and his union banned, but the state behind it was failing, and in 1990 he was elected president. On 11 February 1990 Nelson Mandela walked out of prison after twenty-seven years, and in 1994 he became president of the country that had jailed him. Each of them defied a state that was already breaking. The reversal is a bet on the state's death. Until it is certainly dying, it remains the largest power in the room." },
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
    line: "The flatterers, favourites and keepers of secrets who stand closest to the throne.",
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
    line: "What money builds, and how money buries the ones who built it.",
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
    line: "Fear, force and war, and the day they turn on their master.",
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
    line: "The crowd that crowns, and the square that brings it down.",
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
    line: "Time, heirs, and the art of leaving before you are removed.",
    laws: [
      { n: 26, title: "Leave the Table When the Meal Is Over", opener: "Robert Mugabe", place: "Harare, 2017" },
      { n: 27, title: "Name Your Heir or Your Heirs Will Name Themselves", opener: "Amado Carrillo Fuentes", place: "Mexico City, 1997" },
      { n: 28, title: "Fame Is the Fugitive's Last Mistake", opener: "Joaquín Guzmán, El Chapo", place: "Los Mochis, 2016" },
      { n: 29, title: "Know When Your Season Is Over", opener: "Haile Selassie", place: "Addis Ababa, 1974" },
      { n: 30, title: "Even the Wisest Can Fall", opener: "King Solomon", place: "Jerusalem, tenth century BC" },
    ],
  },
];
