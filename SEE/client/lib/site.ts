// Facts about the publisher and the sale, used by the legal pages and anywhere else that needs them.
// Change a value here and every page that shows it changes with it.

export const CONTACT_EMAIL = "lawofruin@gmail.com";

export const SITE = {
  book: "The Laws of Ruin",
  investigation: "Investigation I: The Fall of Kings",
  publisher: "Orion Learning Innovations",
  team: "the Publications Team of Orion Learning Innovations",
  place: "Lagos, Nigeria",
  email: CONTACT_EMAIL,
  earlyBird: { price: "$7", from: "17 November 2026", until: "19 December 2026" },
  standard: { price: "$10", from: "20 December 2026" },
  partOneOpens: "20 December 2026",
  lastUpdated: "11 November 2026",
};

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
  { href: "/contact", label: "Contact" },
];
