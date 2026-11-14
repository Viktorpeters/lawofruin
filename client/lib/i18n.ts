/* The words of the reader's interface in each language. The book's own text comes from the
   server in the chosen language; these are the buttons, panels and labels around it. */

export const LANGS = [
  { code: "en", short: "EN", name: "English" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "es", short: "ES", name: "Español" },
  { code: "pt", short: "PT", name: "Português" },
  { code: "de", short: "DE", name: "Deutsch" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];

const en = {
  contents: "Contents", whoswho: "Who's Who", purchases: "Purchases", earn: "Earn", appearance: "Appearance", ask: "Ask", account: "Your account",
  askTitle: "Ask the book", openMenu: "Open menu", closeMenu: "Close menu", close: "Close", swipe: "Swipe to open", language: "Language",
  openingPages: "Opening pages", cover: "The cover", titlePage: "Title page", dedication: "Dedication", epigraph: "Epigraph",
  prefaceGroup: "Preface · The Cycle", beforeLaws: "Before the laws", which: "Which are you?", thirtyLaws: "The thirty laws", investigation: "Investigation I", part: "Part",
  findName: "Find a name", files: "{n} files · readable offline",
  textSize: "Text size", smaller: "Smaller", standard: "Standard", larger: "Larger", menuButton: "Menu button", rightHand: "Right hand", leftHand: "Left hand",
  theBook: "The book", showTurn: "Show how to turn the pages", fromCover: "Read from the cover again",
  signInLead: "Sign in with your email to buy the book, ask it questions and get your own link to earn. No password: we send you a code.",
  emailPh: "Your email address", sendCode: "Send me a code",
  codeSent: "We sent a 6-digit code to {email}. It works for 10 minutes.", codePh: "6-digit code", signIn: "Sign in", changeEmail: "Use another email",
  signedInAs: "Signed in as", signOut: "Sign out", about: "About",
  aboutText: "The Laws of Ruin is researched, written and published by the Publications Team of Orion Learning Innovations, an edtech company in Lagos, Nigeria.",
  licence: "Licence", licenceText: "© 2026 Orion Learning Innovations. All rights reserved. Licensed for reading inside this app, to the account that bought it.",
  owned: "Yours", buy: "Buy", payNaira: "Pay in naira", payDollars: "Pay in dollars", checkoutSoon: "Checkout opens 17 November",
  thenPrice: "{price} from 20 December", includes: "All six parts and every revised edition. One payment, yours for life.", signInToBuy: "Sign in to buy",
  earnLead: "Share your link. When someone buys the book through it, you earn 20% of what they pay.",
  yourLink: "Your link", copy: "Copy link", copied: "Copied", clicks: "Clicks", paid: "Paid", earned: "Earned", pending: "{x} pending",
  earnRules: "Earnings become available 14 days after each purchase. Payouts go to Nigerian bank accounts for now; more countries soon.",
  signInToEarn: "Sign in to get your link",
  askOwner: "Ask about any law, any person or any moment in the book.",
  askMember: "Before you buy, I can tell you about release dates, the price, the languages and how to buy. Everything else opens once the book is yours.",
  askPh: "Your question", send: "Send", signInToAsk: "Sign in to ask", thinking: "Thinking",
  law: "Law", opensOn: "Opens on", key: "KEY", openSections: "Open the {n} sections", opens: "Opens", noConnection: "Connect to the internet once to download the book.", retry: "Try again",
};

type Dict = typeof en;

const fr: Dict = {
  contents: "Sommaire", whoswho: "Qui est qui", purchases: "Achats", earn: "Gagner", appearance: "Affichage", ask: "Demander", account: "Votre compte",
  askTitle: "Interroger le livre", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", close: "Fermer", swipe: "Glissez pour ouvrir", language: "Langue",
  openingPages: "Pages d'ouverture", cover: "La couverture", titlePage: "Page de titre", dedication: "Dédicace", epigraph: "Épigraphe",
  prefaceGroup: "Préface · Le Cycle", beforeLaws: "Avant les lois", which: "Lequel êtes-vous ?", thirtyLaws: "Les trente lois", investigation: "Enquête I", part: "Partie",
  findName: "Chercher un nom", files: "{n} fiches · lisibles hors ligne",
  textSize: "Taille du texte", smaller: "Plus petit", standard: "Normal", larger: "Plus grand", menuButton: "Bouton du menu", rightHand: "Main droite", leftHand: "Main gauche",
  theBook: "Le livre", showTurn: "Montrer comment tourner les pages", fromCover: "Relire depuis la couverture",
  signInLead: "Connectez-vous avec votre e-mail pour acheter le livre, lui poser des questions et obtenir votre lien pour gagner. Pas de mot de passe : nous vous envoyons un code.",
  emailPh: "Votre adresse e-mail", sendCode: "Recevoir un code",
  codeSent: "Nous avons envoyé un code à 6 chiffres à {email}. Il est valable 10 minutes.", codePh: "Code à 6 chiffres", signIn: "Se connecter", changeEmail: "Utiliser une autre adresse",
  signedInAs: "Connecté en tant que", signOut: "Se déconnecter", about: "À propos",
  aboutText: "The Laws of Ruin est écrit et publié par l'équipe Publications d'Orion Learning Innovations, une entreprise edtech de Lagos, au Nigeria.",
  licence: "Licence", licenceText: "© 2026 Orion Learning Innovations. Tous droits réservés. Licence de lecture dans cette application, pour le compte qui l'a acheté.",
  owned: "À vous", buy: "Acheter", payNaira: "Payer en naira", payDollars: "Payer en dollars", checkoutSoon: "Paiement ouvert le 17 novembre",
  thenPrice: "{price} à partir du 20 décembre", includes: "Les six parties et chaque édition révisée. Un seul paiement, à vous pour toujours.", signInToBuy: "Se connecter pour acheter",
  earnLead: "Partagez votre lien. Quand quelqu'un achète le livre grâce à lui, vous gagnez 20 % de ce qu'il paie.",
  yourLink: "Votre lien", copy: "Copier le lien", copied: "Copié", clicks: "Clics", paid: "Payés", earned: "Gagné", pending: "{x} en attente",
  earnRules: "Les gains sont disponibles 14 jours après chaque achat. Les versements se font pour l'instant sur des comptes bancaires nigérians ; d'autres pays suivront.",
  signInToEarn: "Se connecter pour obtenir votre lien",
  askOwner: "Posez une question sur n'importe quelle loi, personne ou moment du livre.",
  askMember: "Avant l'achat, je peux vous parler des dates de sortie, du prix, des langues et de la façon d'acheter. Le reste s'ouvre quand le livre est à vous.",
  askPh: "Votre question", send: "Envoyer", signInToAsk: "Se connecter pour demander", thinking: "Réflexion",
  law: "Loi", opensOn: "S'ouvre sur", key: "CLÉ", openSections: "Ouvrir les {n} sections", opens: "Ouvre le", noConnection: "Connectez-vous à Internet une fois pour télécharger le livre.", retry: "Réessayer",
};

const es: Dict = {
  contents: "Índice", whoswho: "Quién es quién", purchases: "Compras", earn: "Ganar", appearance: "Apariencia", ask: "Preguntar", account: "Tu cuenta",
  askTitle: "Pregunta al libro", openMenu: "Abrir menú", closeMenu: "Cerrar menú", close: "Cerrar", swipe: "Desliza para abrir", language: "Idioma",
  openingPages: "Páginas iniciales", cover: "La portada", titlePage: "Portadilla", dedication: "Dedicatoria", epigraph: "Epígrafe",
  prefaceGroup: "Prefacio · El Ciclo", beforeLaws: "Antes de las leyes", which: "¿Cuál eres tú?", thirtyLaws: "Las treinta leyes", investigation: "Investigación I", part: "Parte",
  findName: "Buscar un nombre", files: "{n} fichas · legibles sin conexión",
  textSize: "Tamaño del texto", smaller: "Más pequeño", standard: "Normal", larger: "Más grande", menuButton: "Botón del menú", rightHand: "Mano derecha", leftHand: "Mano izquierda",
  theBook: "El libro", showTurn: "Mostrar cómo pasar las páginas", fromCover: "Leer de nuevo desde la portada",
  signInLead: "Inicia sesión con tu correo para comprar el libro, hacerle preguntas y obtener tu enlace para ganar. Sin contraseña: te enviamos un código.",
  emailPh: "Tu correo electrónico", sendCode: "Enviarme un código",
  codeSent: "Enviamos un código de 6 dígitos a {email}. Vale 10 minutos.", codePh: "Código de 6 dígitos", signIn: "Entrar", changeEmail: "Usar otro correo",
  signedInAs: "Sesión iniciada como", signOut: "Cerrar sesión", about: "Acerca de",
  aboutText: "The Laws of Ruin está investigado, escrito y publicado por el equipo de Publicaciones de Orion Learning Innovations, una empresa edtech de Lagos, Nigeria.",
  licence: "Licencia", licenceText: "© 2026 Orion Learning Innovations. Todos los derechos reservados. Licencia de lectura en esta app, para la cuenta que lo compró.",
  owned: "Tuyo", buy: "Comprar", payNaira: "Pagar en nairas", payDollars: "Pagar en dólares", checkoutSoon: "El pago abre el 17 de noviembre",
  thenPrice: "{price} desde el 20 de diciembre", includes: "Las seis partes y cada edición revisada. Un solo pago, tuyo para siempre.", signInToBuy: "Inicia sesión para comprar",
  earnLead: "Comparte tu enlace. Cuando alguien compre el libro a través de él, ganas el 20 % de lo que pague.",
  yourLink: "Tu enlace", copy: "Copiar enlace", copied: "Copiado", clicks: "Clics", paid: "Pagaron", earned: "Ganado", pending: "{x} pendiente",
  earnRules: "Las ganancias están disponibles 14 días después de cada compra. Por ahora los pagos van a cuentas bancarias de Nigeria; pronto más países.",
  signInToEarn: "Inicia sesión para obtener tu enlace",
  askOwner: "Pregunta sobre cualquier ley, persona o momento del libro.",
  askMember: "Antes de comprar, puedo hablarte de las fechas, el precio, los idiomas y cómo comprar. Todo lo demás se abre cuando el libro sea tuyo.",
  askPh: "Tu pregunta", send: "Enviar", signInToAsk: "Inicia sesión para preguntar", thinking: "Pensando",
  law: "Ley", opensOn: "Empieza con", key: "CLAVE", openSections: "Abrir las {n} secciones", opens: "Abre el", noConnection: "Conéctate a internet una vez para descargar el libro.", retry: "Reintentar",
};

const pt: Dict = {
  contents: "Sumário", whoswho: "Quem é quem", purchases: "Compras", earn: "Ganhar", appearance: "Aparência", ask: "Perguntar", account: "Sua conta",
  askTitle: "Pergunte ao livro", openMenu: "Abrir menu", closeMenu: "Fechar menu", close: "Fechar", swipe: "Deslize para abrir", language: "Idioma",
  openingPages: "Páginas iniciais", cover: "A capa", titlePage: "Folha de rosto", dedication: "Dedicatória", epigraph: "Epígrafe",
  prefaceGroup: "Prefácio · O Ciclo", beforeLaws: "Antes das leis", which: "Qual deles é você?", thirtyLaws: "As trinta leis", investigation: "Investigação I", part: "Parte",
  findName: "Procurar um nome", files: "{n} fichas · legíveis offline",
  textSize: "Tamanho do texto", smaller: "Menor", standard: "Normal", larger: "Maior", menuButton: "Botão do menu", rightHand: "Mão direita", leftHand: "Mão esquerda",
  theBook: "O livro", showTurn: "Mostrar como virar as páginas", fromCover: "Ler de novo desde a capa",
  signInLead: "Entre com seu e-mail para comprar o livro, fazer perguntas a ele e receber seu link para ganhar. Sem senha: enviamos um código.",
  emailPh: "Seu e-mail", sendCode: "Enviar um código",
  codeSent: "Enviamos um código de 6 dígitos para {email}. Vale por 10 minutos.", codePh: "Código de 6 dígitos", signIn: "Entrar", changeEmail: "Usar outro e-mail",
  signedInAs: "Conectado como", signOut: "Sair", about: "Sobre",
  aboutText: "The Laws of Ruin é pesquisado, escrito e publicado pela equipe de Publicações da Orion Learning Innovations, uma empresa de edtech em Lagos, Nigéria.",
  licence: "Licença", licenceText: "© 2026 Orion Learning Innovations. Todos os direitos reservados. Licenciado para leitura neste app, para a conta que o comprou.",
  owned: "Seu", buy: "Comprar", payNaira: "Pagar em naira", payDollars: "Pagar em dólares", checkoutSoon: "O pagamento abre em 17 de novembro",
  thenPrice: "{price} a partir de 20 de dezembro", includes: "As seis partes e toda edição revisada. Um só pagamento, seu para sempre.", signInToBuy: "Entre para comprar",
  earnLead: "Compartilhe seu link. Quando alguém comprar o livro por ele, você ganha 20% do que a pessoa pagar.",
  yourLink: "Seu link", copy: "Copiar link", copied: "Copiado", clicks: "Cliques", paid: "Pagaram", earned: "Ganho", pending: "{x} pendente",
  earnRules: "Os ganhos ficam disponíveis 14 dias após cada compra. Por enquanto, os pagamentos vão para contas bancárias na Nigéria; mais países em breve.",
  signInToEarn: "Entre para receber seu link",
  askOwner: "Pergunte sobre qualquer lei, pessoa ou momento do livro.",
  askMember: "Antes da compra, posso falar das datas, do preço, dos idiomas e de como comprar. O resto abre quando o livro for seu.",
  askPh: "Sua pergunta", send: "Enviar", signInToAsk: "Entre para perguntar", thinking: "Pensando",
  law: "Lei", opensOn: "Começa com", key: "CHAVE", openSections: "Abrir as {n} seções", opens: "Abre em", noConnection: "Conecte-se à internet uma vez para baixar o livro.", retry: "Tentar de novo",
};

const de: Dict = {
  contents: "Inhalt", whoswho: "Wer ist wer", purchases: "Käufe", earn: "Verdienen", appearance: "Darstellung", ask: "Fragen", account: "Ihr Konto",
  askTitle: "Das Buch fragen", openMenu: "Menü öffnen", closeMenu: "Menü schließen", close: "Schließen", swipe: "Zum Öffnen wischen", language: "Sprache",
  openingPages: "Anfangsseiten", cover: "Der Einband", titlePage: "Titelseite", dedication: "Widmung", epigraph: "Motto",
  prefaceGroup: "Vorwort · Der Kreislauf", beforeLaws: "Vor den Gesetzen", which: "Wer sind Sie?", thirtyLaws: "Die dreißig Gesetze", investigation: "Untersuchung I", part: "Teil",
  findName: "Namen suchen", files: "{n} Akten · offline lesbar",
  textSize: "Schriftgröße", smaller: "Kleiner", standard: "Normal", larger: "Größer", menuButton: "Menütaste", rightHand: "Rechte Hand", leftHand: "Linke Hand",
  theBook: "Das Buch", showTurn: "Zeigen, wie man umblättert", fromCover: "Wieder vom Einband an lesen",
  signInLead: "Melden Sie sich mit Ihrer E-Mail an, um das Buch zu kaufen, ihm Fragen zu stellen und Ihren Link zum Verdienen zu erhalten. Kein Passwort: Wir senden Ihnen einen Code.",
  emailPh: "Ihre E-Mail-Adresse", sendCode: "Code senden",
  codeSent: "Wir haben einen 6-stelligen Code an {email} gesendet. Er gilt 10 Minuten.", codePh: "6-stelliger Code", signIn: "Anmelden", changeEmail: "Andere E-Mail verwenden",
  signedInAs: "Angemeldet als", signOut: "Abmelden", about: "Über",
  aboutText: "The Laws of Ruin wird vom Publikationsteam von Orion Learning Innovations recherchiert, geschrieben und veröffentlicht, einem Edtech-Unternehmen in Lagos, Nigeria.",
  licence: "Lizenz", licenceText: "© 2026 Orion Learning Innovations. Alle Rechte vorbehalten. Lizenziert zum Lesen in dieser App, für das Konto, das es gekauft hat.",
  owned: "Ihres", buy: "Kaufen", payNaira: "In Naira zahlen", payDollars: "In Dollar zahlen", checkoutSoon: "Kauf ab 17. November",
  thenPrice: "{price} ab 20. Dezember", includes: "Alle sechs Teile und jede überarbeitete Ausgabe. Eine Zahlung, für immer Ihres.", signInToBuy: "Zum Kaufen anmelden",
  earnLead: "Teilen Sie Ihren Link. Kauft jemand das Buch darüber, erhalten Sie 20 % des Betrags.",
  yourLink: "Ihr Link", copy: "Link kopieren", copied: "Kopiert", clicks: "Klicks", paid: "Gekauft", earned: "Verdient", pending: "{x} ausstehend",
  earnRules: "Verdienste werden 14 Tage nach jedem Kauf verfügbar. Auszahlungen gehen vorerst auf nigerianische Bankkonten; weitere Länder folgen.",
  signInToEarn: "Anmelden, um Ihren Link zu erhalten",
  askOwner: "Fragen Sie nach jedem Gesetz, jeder Person und jedem Moment im Buch.",
  askMember: "Vor dem Kauf kann ich Ihnen Erscheinungstermine, Preis, Sprachen und den Kauf erklären. Alles andere öffnet sich, sobald das Buch Ihnen gehört.",
  askPh: "Ihre Frage", send: "Senden", signInToAsk: "Zum Fragen anmelden", thinking: "Denke nach",
  law: "Gesetz", opensOn: "Beginnt mit", key: "SCHLÜSSEL", openSections: "Die {n} Abschnitte öffnen", opens: "Ab", noConnection: "Verbinden Sie sich einmal mit dem Internet, um das Buch zu laden.", retry: "Erneut versuchen",
};

const DICTS: Record<Lang, Dict> = { en, fr, es, pt, de };

export type Key = keyof Dict;

export function t(lang: Lang, key: Key, vars: Record<string, string | number> = {}) {
  let s = (DICTS[lang] ?? en)[key] ?? en[key];
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

const LANG_KEY = "lor-lang";

export function savedLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v && LANGS.some((l) => l.code === v)) return v as Lang;
  } catch { /* ignore */ }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "en").slice(0, 2);
  return (LANGS.some((l) => l.code === nav) ? nav : "en") as Lang;
}

export function saveLang(l: Lang) {
  try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
}
