/* The front matter: the approved words of Front 1 to Front 4, plus the two pages that come
   after the Preface ("For those who seek power" and "Which are you?"). */

export const TITLE = {
  series: "Investigation I",
  name: ["The Laws", "of Ruin"],
  sub: "The Fall of Kings",
  by: "An investigation by",
  house: "Orion Learning Innovations",
  team: "Publications Team",
  place: "Lagos · 2026",
};

export const COPYRIGHT: string[] = [
  "The Laws of Ruin. Investigation I: The Fall of Kings",
  "Copyright © 2026 Orion Learning Innovations. All rights reserved.",
  "No part of this book may be copied, reproduced, stored, shared or transmitted in any form or by any means, electronic or mechanical, including screenshots, recordings and photocopies, without written permission from the publisher, except for brief quotations in reviews and articles.",
  "This book is licensed for reading inside the Laws of Ruin app, to the account that bought it. It may not be resold, shared or redistributed.",
  "The events in this book are drawn from the public record and the sources named in it. Where a fact is disputed, the book says so. Composite characters are identified as such. The book does not endorse any crime or act of violence it describes, and nothing in it is legal, financial or medical advice.",
  "Quotations from scripture are from the King James Version (1611). Quotations from older works are in the public domain or in the publisher's own translation.",
  "First published in December 2026 by Orion Learning Innovations, Lagos, Nigeria.",
  "Investigation I, first release. Corrections are made in the book itself, for every reader.",
];

export const DEDICATION = ["To my father, my mother,", "and my siblings,", "who have always been there,", "no matter the cost."];

export const EPIGRAPHS = [
  {
    lines: [
      "“My name is Ozymandias, King of Kings;",
      "Look on my Works, ye Mighty, and despair!”",
      "Nothing beside remains. Round the decay",
      "Of that colossal Wreck, boundless and bare",
      "The lone and level sands stretch far away.",
    ],
    who: "Percy Bysshe Shelley",
    from: "“Ozymandias,” 1818",
  },
  {
    lines: ["“The past resembles the future more than one drop of water resembles another.”"],
    who: "Ibn Khaldun",
    from: "the Muqaddimah, 1377",
  },
];

export const FOR_THOSE = {
  line: "For those who seek power,",
  italic: "and those who must keep it.",
  realms: ["The office", "The pulpit", "The palace", "The street"],
};

export const WHICH = {
  kicker: "Before you go on",
  title: "Which are you?",
  lead: "Every law ends with Keys for both. We will open yours first. You can change this at any time.",
  options: [
    { id: "rising", name: "Rising", line: "I am climbing toward power." },
    { id: "holding", name: "Holding", line: "I have power, and I mean to keep it." },
    { id: "watching", name: "Watching", line: "I study how power works." },
  ],
};

export const END = {
  kicker: "Investigation I",
  title: "Part One opens on 17 December 2026.",
  line: "Until then, the Preface and the Contents are yours to read. The first law is Never Make the State Your Rival.",
};
