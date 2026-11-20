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
  coverTitle: "THE|LAWS OF|RUIN", partWords: "One|Two|Three|Four|Five|Six", turnOn: "Turn the page to go on", srcSection: "Sources for this section",
  contents: "Contents", whoswho: "Who's Who", purchases: "Purchases", earn: "Earn", appearance: "Appearance", ask: "Ask", account: "Your account",
  askTitle: "Ask the book", openMenu: "Open menu", closeMenu: "Close menu", close: "Close", swipe: "Swipe to open", language: "Language",
  openingPages: "Opening pages", cover: "The cover", titlePage: "Title page", dedication: "Dedication", epigraph: "Epigraph",
  prefaceGroup: "Preface · The Cycle", beforeLaws: "Before the laws", which: "Which are you?", thirtyLaws: "The thirty laws", investigation: "Investigation I", part: "Part",
  findName: "Find a name", files: "{n} files · readable offline",
  largest: "Largest", tapName: "Tap a name to open the file", ok: "OK", textSize: "Text size", smaller: "Smaller", standard: "Standard", larger: "Larger", menuButton: "Menu button", rightHand: "Right hand", leftHand: "Left hand",
  tools: "Tools", closeTools: "Close the tools", exitTool: "Leave this tool", gotIt: "Got it", tHighlight: "Highlight", tNote: "Note", tBookmark: "Bookmark", tMeanings: "Meanings", tTurn: "Turning", tLandscape: "Landscape", hHighlight: "Pick a colour, then run your finger across the words, as many places on the page as you like. Pages stop turning until you tap ×.", hNote: "Tap a sentence to write a note under it, or tap Page note to write on the page itself. Each note keeps its section and page, like a reader's diary.", hBookmark: "Fold the corner of this page, so you can come straight back to it.", hMeanings: "Words with a meaning get a dotted line. Tap one to see what it means, with its source.", hTurn: "Choose how pages turn: Flip, like paper, or Carousel, one page for every swipe.", hLandscape: "Turn the whole book sideways, as one wide page.", soon: "Arrives in the next update", eraser: "Eraser", bookmarks: "Bookmarks", notes: "Notes", folders: "Folders", highlights: "Highlights", changeColour: "Change colour", c_y: "Yellow", c_r: "Red", c_g: "Green", c_b: "Blue", c_p: "Pink", c_v: "Violet", removeBmShort: "Remove", allNotes: "All notes", newFolder: "New folder", folderName: "Folder name", create: "Create", rename: "Rename", deleteFolder: "Delete folder", shareAll: "Share all as pictures", moveTo: "Move to folder", noFolder: "No folder", movedTo: "Moved to {f}", sortByDay: "Sort by day", folderEmpty: "No notes here yet. Hold a note in All notes and drag it onto this folder.", dragHint: "Hold a note, then drag it onto a folder", folderDeleted: "Folder deleted. Its notes are in All notes.", noteCount: "{n} notes", oneNote: "1 note", pageNote: "Page note", tapLineOr: "Tap a line, or", writeNote: "Write your note", cancel: "Cancel", saveNote: "Save", edit: "Edit", done: "Done", del: "Delete", delSure: "Tap again to delete", noteSaved: "Note saved", noteDeleted: "Note deleted", copyText: "Copy text", textCopied: "Text copied", goToPage: "Go to the page", sharePic: "Share as picture", savePng: "Save as PNG", editNote: "Edit note", options: "Options", noteBuyers: "Notes on the laws come with the book. The Preface is yours to write in.", style: "Style", margin: "Margin", reply: "Reply", noteBy: "{n}'s note", pageNoteLabel: "A reader's page note", shareNote: "Share this note", bmAdded: "Page bookmarked", bmRemoved: "Bookmark removed", removeBm: "Remove bookmark", noBmHere: "Bookmarks are for the pages of the book", hlBuyers: "Highlighting the laws comes with the book. The Preface is yours to mark.",
  preface: "Preface", share: "Share", save: "Save", shareTitle: "Share this line", size: "Size", square: "Square", post: "Post", story: "Story", colour: "Colour", yourName: "Your name", showName: "Sign it with my name", showBefore: "Show the sentence before", mission: "Wisdom across the ages, on your phone.", markedBy: "marked by", savedImg: "Saved to your device", sharing: "Getting it ready",
  theBook: "The book", showTurn: "Show how to turn the pages", fromCover: "Read from the cover again",
  signInLead: "Sign in with your email to buy the book, ask it questions and get your own link to earn. No password: we send you a code.",
  emailPh: "Your email address", sendCode: "Send me a code", sending: "Sending code", signingIn: "Signing in",
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
  askLeft: "{n} questions left today", askPh: "Your question", send: "Send", signInToAsk: "Sign in to ask", thinking: "Thinking",
  judgment: "Judgment", law: "Law", opensOn: "Opens on", key: "KEY", openSections: "Open the {n} sections", opens: "Opens", noConnection: "Connect to the internet once to download the book.", retry: "Try again",
};

type Dict = typeof en;

const fr: Dict = {
  coverTitle: "LES|LOIS DE|LA RUINE", partWords: "Un|Deux|Trois|Quatre|Cinq|Six", turnOn: "Tournez la page pour continuer", srcSection: "Sources de cette section",
  contents: "Sommaire", whoswho: "Qui est qui", purchases: "Achats", earn: "Gagner", appearance: "Affichage", ask: "Demander", account: "Votre compte",
  askTitle: "Interroger le livre", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", close: "Fermer", swipe: "Glissez pour ouvrir", language: "Langue",
  openingPages: "Pages d'ouverture", cover: "La couverture", titlePage: "Page de titre", dedication: "Dédicace", epigraph: "Épigraphe",
  prefaceGroup: "Préface · Le Cycle", beforeLaws: "Avant les lois", which: "Lequel êtes-vous ?", thirtyLaws: "Les trente lois", investigation: "Enquête I", part: "Partie",
  findName: "Chercher un nom", files: "{n} fiches · lisibles hors ligne",
  largest: "Très grand", tapName: "Touchez un nom pour ouvrir sa fiche", ok: "OK", textSize: "Taille du texte", smaller: "Plus petit", standard: "Normal", larger: "Plus grand", menuButton: "Bouton du menu", rightHand: "Main droite", leftHand: "Main gauche",
  tools: "Outils", closeTools: "Fermer les outils", exitTool: "Quitter cet outil", gotIt: "Compris", tHighlight: "Surligner", tNote: "Note", tBookmark: "Signet", tMeanings: "Sens", tTurn: "Tourner", tLandscape: "Paysage", hHighlight: "Choisissez une couleur, puis passez le doigt sur les mots, à autant d'endroits de la page que vous voulez. Les pages ne tournent plus jusqu'à ce que vous touchiez ×.", hNote: "Touchez une phrase pour écrire une note dessous, ou touchez Note de page pour écrire sur la page elle-même. Chaque note garde sa section et sa page, comme le carnet d'un lecteur.", hBookmark: "Cornez cette page pour y revenir directement.", hMeanings: "Les mots qui ont un sens reçoivent un trait pointillé. Touchez-en un pour voir ce qu'il veut dire, avec sa source.", hTurn: "Choisissez comment tournent les pages : Feuilleter, comme le papier, ou Carrousel, une page par glissement.", hLandscape: "Tournez tout le livre sur le côté, en une seule page large.", soon: "Arrive dans la prochaine mise à jour", eraser: "Gomme", bookmarks: "Marque-pages", notes: "Notes", folders: "Dossiers", highlights: "Surlignages", changeColour: "Changer la couleur", c_y: "Jaune", c_r: "Rouge", c_g: "Vert", c_b: "Bleu", c_p: "Rose", c_v: "Violet", removeBmShort: "Retirer", allNotes: "Toutes les notes", newFolder: "Nouveau dossier", folderName: "Nom du dossier", create: "Créer", rename: "Renommer", deleteFolder: "Supprimer le dossier", shareAll: "Tout partager en images", moveTo: "Déplacer vers un dossier", noFolder: "Aucun dossier", movedTo: "Déplacée vers {f}", sortByDay: "Trier par jour", folderEmpty: "Pas encore de notes ici. Dans Toutes les notes, maintenez une note et glissez-la sur ce dossier.", dragHint: "Maintenez une note, puis glissez-la sur un dossier", folderDeleted: "Dossier supprimé. Ses notes sont dans Toutes les notes.", noteCount: "{n} notes", oneNote: "1 note", pageNote: "Note de page", tapLineOr: "Touchez une ligne, ou", writeNote: "Écrivez votre note", cancel: "Annuler", saveNote: "Enregistrer", edit: "Modifier", done: "Terminé", del: "Supprimer", delSure: "Touchez encore pour supprimer", noteSaved: "Note enregistrée", noteDeleted: "Note supprimée", copyText: "Copier le texte", textCopied: "Texte copié", goToPage: "Aller à la page", sharePic: "Partager en image", savePng: "Enregistrer en PNG", editNote: "Modifier la note", options: "Options", noteBuyers: "Les notes sur les lois viennent avec le livre. La préface est à vous.", style: "Style", margin: "Marge", reply: "Réponse", noteBy: "Note de {n}", pageNoteLabel: "Note de page d'un lecteur", shareNote: "Partager cette note", bmAdded: "Page cornée", bmRemoved: "Marque-page retiré", removeBm: "Retirer le marque-page", noBmHere: "Les marque-pages sont pour les pages du livre", hlBuyers: "Surligner les lois vient avec le livre. La préface est à vous.",
  preface: "Préface", share: "Partager", save: "Enregistrer", shareTitle: "Partager cette ligne", size: "Format", square: "Carré", post: "Post", story: "Story", colour: "Couleur", yourName: "Votre nom", showName: "Signer de mon nom", showBefore: "Afficher la phrase d'avant", mission: "La sagesse des siècles, dans votre téléphone.", markedBy: "souligné par", savedImg: "Enregistré sur votre appareil", sharing: "Préparation",
  theBook: "Le livre", showTurn: "Montrer comment tourner les pages", fromCover: "Relire depuis la couverture",
  signInLead: "Connectez-vous avec votre e-mail pour acheter le livre, lui poser des questions et obtenir votre lien pour gagner. Pas de mot de passe : nous vous envoyons un code.",
  emailPh: "Votre adresse e-mail", sendCode: "Recevoir un code", sending: "Envoi du code", signingIn: "Connexion",
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
  askLeft: "Encore {n} questions aujourd'hui", askPh: "Votre question", send: "Envoyer", signInToAsk: "Se connecter pour demander", thinking: "Réflexion",
  judgment: "Jugement", law: "Loi", opensOn: "S'ouvre sur", key: "CLÉ", openSections: "Ouvrir les {n} sections", opens: "Ouvre le", noConnection: "Connectez-vous à Internet une fois pour télécharger le livre.", retry: "Réessayer",
};

const es: Dict = {
  coverTitle: "LAS|LEYES DE|LA RUINA", partWords: "Uno|Dos|Tres|Cuatro|Cinco|Seis", turnOn: "Pasa la página para continuar", srcSection: "Fuentes de esta sección",
  contents: "Índice", whoswho: "Quién es quién", purchases: "Compras", earn: "Ganar", appearance: "Apariencia", ask: "Preguntar", account: "Tu cuenta",
  askTitle: "Pregunta al libro", openMenu: "Abrir menú", closeMenu: "Cerrar menú", close: "Cerrar", swipe: "Desliza para abrir", language: "Idioma",
  openingPages: "Páginas iniciales", cover: "La portada", titlePage: "Portadilla", dedication: "Dedicatoria", epigraph: "Epígrafe",
  prefaceGroup: "Prefacio · El Ciclo", beforeLaws: "Antes de las leyes", which: "¿Cuál eres tú?", thirtyLaws: "Las treinta leyes", investigation: "Investigación I", part: "Parte",
  findName: "Buscar un nombre", files: "{n} fichas · legibles sin conexión",
  largest: "Muy grande", tapName: "Toca un nombre para abrir su ficha", ok: "OK", textSize: "Tamaño del texto", smaller: "Más pequeño", standard: "Normal", larger: "Más grande", menuButton: "Botón del menú", rightHand: "Mano derecha", leftHand: "Mano izquierda",
  tools: "Herramientas", closeTools: "Cerrar las herramientas", exitTool: "Salir de esta herramienta", gotIt: "Entendido", tHighlight: "Resaltar", tNote: "Nota", tBookmark: "Marcador", tMeanings: "Definir", tTurn: "Páginas", tLandscape: "Apaisado", hHighlight: "Elige un color y pasa el dedo por las palabras, en tantos lugares de la página como quieras. Las páginas dejan de pasar hasta que tocas ×.", hNote: "Toca una frase para escribir una nota debajo, o toca Nota de página para escribir en la página. Cada nota guarda su sección y su página, como el diario de un lector.", hBookmark: "Dobla la esquina de esta página para volver directamente a ella.", hMeanings: "Las palabras con significado llevan una línea punteada. Toca una para ver qué significa, con su fuente.", hTurn: "Elige cómo pasan las páginas: Hojear, como el papel, o Carrusel, una página por cada deslizamiento.", hLandscape: "Gira todo el libro de lado, como una sola página ancha.", soon: "Llega en la próxima actualización", eraser: "Borrador", bookmarks: "Marcadores", bmAdded: "Página marcada", bmRemoved: "Marcador quitado", notes: "Notas", folders: "Carpetas", highlights: "Resaltados", changeColour: "Cambiar el color", c_y: "Amarillo", c_r: "Rojo", c_g: "Verde", c_b: "Azul", c_p: "Rosa", c_v: "Violeta", removeBmShort: "Quitar", allNotes: "Todas las notas", newFolder: "Nueva carpeta", folderName: "Nombre de la carpeta", create: "Crear", rename: "Renombrar", deleteFolder: "Eliminar carpeta", shareAll: "Compartir todo como imágenes", moveTo: "Mover a carpeta", noFolder: "Sin carpeta", movedTo: "Movida a {f}", sortByDay: "Ordenar por día", folderEmpty: "Aún no hay notas aquí. En Todas las notas, mantén pulsada una nota y arrástrala a esta carpeta.", dragHint: "Mantén pulsada una nota y arrástrala a una carpeta", folderDeleted: "Carpeta eliminada. Sus notas están en Todas las notas.", noteCount: "{n} notas", oneNote: "1 nota", pageNote: "Nota de página", tapLineOr: "Toca una línea, o", writeNote: "Escribe tu nota", cancel: "Cancelar", saveNote: "Guardar", edit: "Editar", done: "Listo", del: "Eliminar", delSure: "Toca otra vez para eliminar", noteSaved: "Nota guardada", noteDeleted: "Nota eliminada", copyText: "Copiar texto", textCopied: "Texto copiado", goToPage: "Ir a la página", sharePic: "Compartir como imagen", savePng: "Guardar como PNG", editNote: "Editar nota", options: "Opciones", noteBuyers: "Las notas en las leyes vienen con el libro. El prefacio es tuyo.", style: "Estilo", margin: "Margen", reply: "Respuesta", noteBy: "Nota de {n}", pageNoteLabel: "Nota de página de un lector", shareNote: "Compartir esta nota", removeBm: "Quitar el marcador", noBmHere: "Los marcadores son para las páginas del libro", hlBuyers: "Resaltar las leyes viene con el libro. El prefacio es tuyo para marcar.",
  preface: "Prefacio", share: "Compartir", save: "Guardar", shareTitle: "Compartir esta línea", size: "Formato", square: "Cuadrado", post: "Post", story: "Historia", colour: "Color", yourName: "Tu nombre", showName: "Firmar con mi nombre", showBefore: "Mostrar la frase anterior", mission: "La sabiduría de los siglos, en tu teléfono.", markedBy: "marcado por", savedImg: "Guardado en tu dispositivo", sharing: "Preparando",
  theBook: "El libro", showTurn: "Mostrar cómo pasar las páginas", fromCover: "Leer de nuevo desde la portada",
  signInLead: "Inicia sesión con tu correo para comprar el libro, hacerle preguntas y obtener tu enlace para ganar. Sin contraseña: te enviamos un código.",
  emailPh: "Tu correo electrónico", sendCode: "Enviarme un código", sending: "Enviando el código", signingIn: "Entrando",
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
  askLeft: "Te quedan {n} preguntas hoy", askPh: "Tu pregunta", send: "Enviar", signInToAsk: "Inicia sesión para preguntar", thinking: "Pensando",
  judgment: "Juicio", law: "Ley", opensOn: "Empieza con", key: "CLAVE", openSections: "Abrir las {n} secciones", opens: "Abre el", noConnection: "Conéctate a internet una vez para descargar el libro.", retry: "Reintentar",
};

const pt: Dict = {
  coverTitle: "AS|LEIS DA|RUÍNA", partWords: "Um|Dois|Três|Quatro|Cinco|Seis", turnOn: "Vire a página para continuar", srcSection: "Fontes desta seção",
  contents: "Sumário", whoswho: "Quem é quem", purchases: "Compras", earn: "Ganhar", appearance: "Aparência", ask: "Perguntar", account: "Sua conta",
  askTitle: "Pergunte ao livro", openMenu: "Abrir menu", closeMenu: "Fechar menu", close: "Fechar", swipe: "Deslize para abrir", language: "Idioma",
  openingPages: "Páginas iniciais", cover: "A capa", titlePage: "Folha de rosto", dedication: "Dedicatória", epigraph: "Epígrafe",
  prefaceGroup: "Prefácio · O Ciclo", beforeLaws: "Antes das leis", which: "Qual deles é você?", thirtyLaws: "As trinta leis", investigation: "Investigação I", part: "Parte",
  findName: "Procurar um nome", files: "{n} fichas · legíveis offline",
  largest: "Muito grande", tapName: "Toque num nome para abrir a ficha", ok: "OK", textSize: "Tamanho do texto", smaller: "Menor", standard: "Normal", larger: "Maior", menuButton: "Botão do menu", rightHand: "Mão direita", leftHand: "Mão esquerda",
  tools: "Ferramentas", closeTools: "Fechar as ferramentas", exitTool: "Sair desta ferramenta", gotIt: "Entendi", tHighlight: "Destacar", tNote: "Nota", tBookmark: "Marcador", tMeanings: "Definir", tTurn: "Páginas", tLandscape: "Paisagem", hHighlight: "Escolha uma cor e passe o dedo pelas palavras, em quantos lugares da página quiser. As páginas param de virar até você tocar em ×.", hNote: "Toque numa frase para escrever uma nota por baixo, ou toque em Nota de página para escrever na própria página. Cada nota guarda a sua seção e página, como o diário de um leitor.", hBookmark: "Dobre o canto desta página para voltar direto a ela.", hMeanings: "As palavras com significado ganham uma linha pontilhada. Toque numa para ver o que significa, com a fonte.", hTurn: "Escolha como as páginas viram: Folhear, como o papel, ou Carrossel, uma página por cada deslize.", hLandscape: "Vire o livro inteiro de lado, numa só página larga.", soon: "Chega na próxima atualização", eraser: "Borracha", bookmarks: "Marcadores", bmAdded: "Página marcada", bmRemoved: "Marcador removido", notes: "Notas", folders: "Pastas", highlights: "Destaques", changeColour: "Mudar a cor", c_y: "Amarelo", c_r: "Vermelho", c_g: "Verde", c_b: "Azul", c_p: "Rosa", c_v: "Violeta", removeBmShort: "Remover", allNotes: "Todas as notas", newFolder: "Nova pasta", folderName: "Nome da pasta", create: "Criar", rename: "Renomear", deleteFolder: "Apagar pasta", shareAll: "Partilhar tudo como imagens", moveTo: "Mover para pasta", noFolder: "Sem pasta", movedTo: "Movida para {f}", sortByDay: "Ordenar por dia", folderEmpty: "Ainda não há notas aqui. Em Todas as notas, segure uma nota e arraste-a para esta pasta.", dragHint: "Segure uma nota e arraste-a para uma pasta", folderDeleted: "Pasta apagada. As suas notas estão em Todas as notas.", noteCount: "{n} notas", oneNote: "1 nota", pageNote: "Nota de página", tapLineOr: "Toque numa linha, ou", writeNote: "Escreva a sua nota", cancel: "Cancelar", saveNote: "Guardar", edit: "Editar", done: "Pronto", del: "Apagar", delSure: "Toque de novo para apagar", noteSaved: "Nota guardada", noteDeleted: "Nota apagada", copyText: "Copiar texto", textCopied: "Texto copiado", goToPage: "Ir para a página", sharePic: "Partilhar como imagem", savePng: "Guardar como PNG", editNote: "Editar nota", options: "Opções", noteBuyers: "As notas nas leis vêm com o livro. O prefácio é seu.", style: "Estilo", margin: "Margem", reply: "Resposta", noteBy: "Nota de {n}", pageNoteLabel: "Nota de página de um leitor", shareNote: "Partilhar esta nota", removeBm: "Remover o marcador", noBmHere: "Os marcadores são para as páginas do livro", hlBuyers: "Destacar as leis vem com o livro. O prefácio é seu para marcar.",
  preface: "Prefácio", share: "Partilhar", save: "Guardar", shareTitle: "Partilhar esta linha", size: "Formato", square: "Quadrado", post: "Post", story: "Story", colour: "Cor", yourName: "Seu nome", showName: "Assinar com o meu nome", showBefore: "Mostrar a frase anterior", mission: "A sabedoria dos séculos, no seu telefone.", markedBy: "marcado por", savedImg: "Guardado no seu aparelho", sharing: "A preparar",
  theBook: "O livro", showTurn: "Mostrar como virar as páginas", fromCover: "Ler de novo desde a capa",
  signInLead: "Entre com seu e-mail para comprar o livro, fazer perguntas a ele e receber seu link para ganhar. Sem senha: enviamos um código.",
  emailPh: "Seu e-mail", sendCode: "Enviar um código", sending: "Enviando o código", signingIn: "Entrando",
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
  askLeft: "Restam {n} perguntas hoje", askPh: "Sua pergunta", send: "Enviar", signInToAsk: "Entre para perguntar", thinking: "Pensando",
  judgment: "Julgamento", law: "Lei", opensOn: "Começa com", key: "CHAVE", openSections: "Abrir as {n} seções", opens: "Abre em", noConnection: "Conecte-se à internet uma vez para baixar o livro.", retry: "Tentar de novo",
};

const de: Dict = {
  coverTitle: "DIE|GESETZE|DES|UNTERGANGS", partWords: "Eins|Zwei|Drei|Vier|Fünf|Sechs", turnOn: "Blättern Sie um, um weiterzulesen", srcSection: "Quellen zu diesem Abschnitt",
  contents: "Inhalt", whoswho: "Wer ist wer", purchases: "Käufe", earn: "Verdienen", appearance: "Darstellung", ask: "Fragen", account: "Ihr Konto",
  askTitle: "Das Buch fragen", openMenu: "Menü öffnen", closeMenu: "Menü schließen", close: "Schließen", swipe: "Zum Öffnen wischen", language: "Sprache",
  openingPages: "Anfangsseiten", cover: "Der Einband", titlePage: "Titelseite", dedication: "Widmung", epigraph: "Motto",
  prefaceGroup: "Vorwort · Der Kreislauf", beforeLaws: "Vor den Gesetzen", which: "Wer sind Sie?", thirtyLaws: "Die dreißig Gesetze", investigation: "Untersuchung I", part: "Teil",
  findName: "Namen suchen", files: "{n} Akten · offline lesbar",
  largest: "Sehr groß", tapName: "Tippen Sie auf einen Namen, um die Akte zu öffnen", ok: "OK", textSize: "Schriftgröße", smaller: "Kleiner", standard: "Normal", larger: "Größer", menuButton: "Menütaste", rightHand: "Rechte Hand", leftHand: "Linke Hand",
  tools: "Werkzeuge", closeTools: "Werkzeuge schließen", exitTool: "Dieses Werkzeug verlassen", gotIt: "Verstanden", tHighlight: "Markieren", tNote: "Notiz", tBookmark: "Merken", tMeanings: "Erklären", tTurn: "Blättern", tLandscape: "Quer", hHighlight: "Wählen Sie eine Farbe und fahren Sie mit dem Finger über die Wörter, an so vielen Stellen der Seite, wie Sie möchten. Die Seiten blättern erst wieder, wenn Sie × tippen.", hNote: "Tippen Sie auf einen Satz, um darunter eine Notiz zu schreiben, oder auf Seitennotiz, um auf die Seite selbst zu schreiben. Jede Notiz behält ihren Abschnitt und ihre Seite, wie das Tagebuch eines Lesers.", hBookmark: "Knicken Sie die Ecke dieser Seite, um direkt hierher zurückzukehren.", hMeanings: "Wörter mit einer Bedeutung erhalten eine gepunktete Linie. Tippen Sie auf eines, um zu sehen, was es bedeutet, mit Quelle.", hTurn: "Wählen Sie, wie die Seiten wechseln: Blättern, wie Papier, oder Karussell, eine Seite pro Wischen.", hLandscape: "Drehen Sie das ganze Buch zur Seite, als eine breite Seite.", soon: "Kommt mit dem nächsten Update", eraser: "Radierer", bookmarks: "Lesezeichen", notes: "Notizen", folders: "Ordner", highlights: "Markierungen", changeColour: "Farbe ändern", c_y: "Gelb", c_r: "Rot", c_g: "Grün", c_b: "Blau", c_p: "Rosa", c_v: "Violett", removeBmShort: "Entfernen", allNotes: "Alle Notizen", newFolder: "Neuer Ordner", folderName: "Ordnername", create: "Erstellen", rename: "Umbenennen", deleteFolder: "Ordner löschen", shareAll: "Alle als Bilder teilen", moveTo: "In Ordner verschieben", noFolder: "Kein Ordner", movedTo: "Verschoben nach {f}", sortByDay: "Nach Tag ordnen", folderEmpty: "Noch keine Notizen hier. Halten Sie in Alle Notizen eine Notiz gedrückt und ziehen Sie sie auf diesen Ordner.", dragHint: "Notiz gedrückt halten und auf einen Ordner ziehen", folderDeleted: "Ordner gelöscht. Seine Notizen sind in Alle Notizen.", noteCount: "{n} Notizen", oneNote: "1 Notiz", pageNote: "Seitennotiz", tapLineOr: "Tippen Sie auf eine Zeile, oder", writeNote: "Ihre Notiz", cancel: "Abbrechen", saveNote: "Speichern", edit: "Bearbeiten", done: "Fertig", del: "Löschen", delSure: "Nochmals tippen zum Löschen", noteSaved: "Notiz gespeichert", noteDeleted: "Notiz gelöscht", copyText: "Text kopieren", textCopied: "Text kopiert", goToPage: "Zur Seite", sharePic: "Als Bild teilen", savePng: "Als PNG speichern", editNote: "Notiz bearbeiten", options: "Optionen", noteBuyers: "Notizen zu den Gesetzen gehören zum Buch. Ins Vorwort dürfen Sie frei schreiben.", style: "Stil", margin: "Rand", reply: "Antwort", noteBy: "Notiz von {n}", pageNoteLabel: "Seitennotiz eines Lesers", shareNote: "Diese Notiz teilen", bmAdded: "Seite gemerkt", bmRemoved: "Lesezeichen entfernt", removeBm: "Lesezeichen entfernen", noBmHere: "Lesezeichen gibt es für die Seiten des Buches", hlBuyers: "Das Markieren der Gesetze gehört zum Buch. Das Vorwort dürfen Sie frei markieren.",
  preface: "Vorwort", share: "Teilen", save: "Speichern", shareTitle: "Diese Zeile teilen", size: "Format", square: "Quadrat", post: "Beitrag", story: "Story", colour: "Farbe", yourName: "Ihr Name", showName: "Mit meinem Namen signieren", showBefore: "Den Satz davor zeigen", mission: "Die Weisheit der Jahrhunderte, auf Ihrem Handy.", markedBy: "markiert von", savedImg: "Auf Ihrem Gerät gespeichert", sharing: "Wird vorbereitet",
  theBook: "Das Buch", showTurn: "Zeigen, wie man umblättert", fromCover: "Wieder vom Einband an lesen",
  signInLead: "Melden Sie sich mit Ihrer E-Mail an, um das Buch zu kaufen, ihm Fragen zu stellen und Ihren Link zum Verdienen zu erhalten. Kein Passwort: Wir senden Ihnen einen Code.",
  emailPh: "Ihre E-Mail-Adresse", sendCode: "Code senden", sending: "Code wird gesendet", signingIn: "Anmeldung läuft",
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
  askLeft: "Heute noch {n} Fragen", askPh: "Ihre Frage", send: "Senden", signInToAsk: "Zum Fragen anmelden", thinking: "Denke nach",
  judgment: "Urteil", law: "Gesetz", opensOn: "Beginnt mit", key: "SCHLÜSSEL", openSections: "Die {n} Abschnitte öffnen", opens: "Ab", noConnection: "Verbinden Sie sich einmal mit dem Internet, um das Buch zu laden.", retry: "Erneut versuchen",
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
