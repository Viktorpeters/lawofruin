/* Ask, for a reader who has not bought the book. No AI is called, ever. Whatever they ask, they
   get the same honest answer: what the guide is, who it answers, what the book costs, when it
   opens and how to buy. It costs nothing, cannot be wrong, and gives nothing of the book away. */
import { priceFor } from "../pricing/pricing.service";
import type { Lang } from "../book/book.service";

const GENERIC: Record<Lang, (usd: string, ngn: string) => string> = {
  en: (usd, ngn) =>
    `I am the book's guide. I answer questions about every law, person and moment in The Laws of Ruin for readers who own it. One payment of ${usd} (${ngn} in Nigeria) buys all six parts and every revised edition, for life, in five languages. Part One opens on 20 December 2026. To buy, open Purchases in the menu. Once the book is yours, ask me anything in it.`,
  fr: (usd, ngn) =>
    `Je suis le guide du livre. Je réponds aux questions sur chaque loi, personne et moment de The Laws of Ruin pour les lecteurs qui le possèdent. Un seul paiement de ${usd} (${ngn} au Nigeria) donne les six parties et chaque édition révisée, pour toujours, en cinq langues. La première partie s'ouvre le 20 décembre 2026. Pour acheter, ouvrez Achats dans le menu. Une fois le livre à vous, demandez-moi tout ce qu'il contient.`,
  es: (usd, ngn) =>
    `Soy el guía del libro. Respondo preguntas sobre cada ley, persona y momento de The Laws of Ruin a los lectores que lo tienen. Un solo pago de ${usd} (${ngn} en Nigeria) compra las seis partes y cada edición revisada, para siempre, en cinco idiomas. La primera parte abre el 20 de diciembre de 2026. Para comprar, abre Compras en el menú. Cuando el libro sea tuyo, pregúntame lo que quieras sobre él.`,
  pt: (usd, ngn) =>
    `Sou o guia do livro. Respondo perguntas sobre cada lei, pessoa e momento de The Laws of Ruin para os leitores que o possuem. Um só pagamento de ${usd} (${ngn} na Nigéria) compra as seis partes e toda edição revisada, para sempre, em cinco idiomas. A primeira parte abre em 20 de dezembro de 2026. Para comprar, abra Compras no menu. Quando o livro for seu, pergunte o que quiser sobre ele.`,
  de: (usd, ngn) =>
    `Ich bin der Begleiter des Buchs. Ich beantworte Fragen zu jedem Gesetz, jeder Person und jedem Moment in The Laws of Ruin für Leser, denen es gehört. Eine Zahlung von ${usd} (${ngn} in Nigeria) kauft alle sechs Teile und jede überarbeitete Ausgabe, für immer, in fünf Sprachen. Teil eins erscheint am 20. Dezember 2026. Zum Kaufen öffnen Sie Käufe im Menü. Gehört Ihnen das Buch, fragen Sie mich alles darüber.`,
};

export function answerMember(lang: Lang) {
  return GENERIC[lang](priceFor("USD").display, priceFor("NGN").display);
}
