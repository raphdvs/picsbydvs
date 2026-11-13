// =====================================================
//  MEDIAS.JS : le seul fichier à modifier pour ajouter
//  des équipes, des photos, des vidéos, des clients et des tarifs
// =====================================================

// ----- Images optimisées (WebP) -----
// Laisse sur false tant que tu n'as pas lancé optimiser-images.sh.
// Une fois le script lancé, passe à true : le site utilisera alors
// automatiquement les versions légères de tes photos.
//
// Convention de nommage (créée par le script, à ne pas écrire à la main) :
//   photo d'origine : images/soa/DSC05408.jpg
//   vignette 800 px : images/soa/opti/DSC05408-800.webp   (galeries, cartes)
//   grande 2000 px  : images/soa/opti/DSC05408-2000.webp  (agrandissement, bandeaux)
// Les images en ligne (https://...) et les vidéos ne sont pas concernées.
const IMAGES_OPTIMISEES = false;

// ----- Sports et équipes -----
// L'identifiant (à gauche) : minuscules, sans espace ni accent.
// "couverture" = l'image affichée sur la carte de l'équipe et en haut de sa page.
// Elle est FACULTATIVE : sans couverture, la première photo de l'équipe est utilisée
// (exemple : AS Saint-Ouen-l'Aumône ci-dessous).
const SPORTS = {
  football: {
    nom: "Football",
    equipes: {
      "cergy-pontoise":     { nom: "Cergy-Pontoise",         couverture: "https://picsum.photos/seed/cov-fc-cergy/900/700" },
      "saint-ouen-laumone": { nom: "AS Saint-Ouen-l'Aumône" },
      "rc-gonesse":         { nom: "RC Gonesse",             couverture: "https://picsum.photos/seed/cov-gonesse/900/700" },
      "fc-pierrelaye":      { nom: "FC Pierrelaye",          couverture: "https://picsum.photos/seed/cov-pierrelaye/900/700" },
    },
  },
  futsal: {
    nom: "Futsal",
    equipes: {
      "paris-acasa":    { nom: "Paris Acasa",    couverture: "https://picsum.photos/seed/cov-acasa/900/700" },
      "cergy-pontoise": { nom: "Cergy-Pontoise", couverture: "https://picsum.photos/seed/cov-fu-cergy/900/700" },
    },
  },
  hockey: {
    nom: "Hockey",
    equipes: {
      "les-jokers": { nom: "Les Jokers", couverture: "https://picsum.photos/seed/cov-jokers/900/700" },
    },
  },
};

// ----- Catégories (les filtres des pages d'équipe) -----
// Le filtre "Vidéos" est ajouté automatiquement.
const CATEGORIES_SPORT = {
  "media-day": "Media Day",
  "match": "Match",
  "presentation-equipement": "Présentation équipement",
};

const CATEGORIES_SHOOTING = {
  "anniversaire": "Anniversaire",
  "studio": "Studio",
  "restaurant": "Restaurant",
};

// ----- Contenus Sport -----
// Une ligne = une photo ou une vidéo.
// ATTENTION aux majuscules : le chemin doit être écrit EXACTEMENT comme le nom
// du fichier (ex. "images/soa/DSC05408.jpg", pas "dsc05408.jpg"), sinon
// l'image marchera sur ton PC mais sera cassée une fois le site en ligne.
// Vidéo : fichier .mp4 ou .webm + "poster" (image affichée avant la lecture).
// selection: true  →  la photo apparaît aussi dans la « Sélection » de l'accueil
//                     (6 à 8 au total, Sport et Shootings mélangés ; au-delà de 8, les suivantes sont ignorées).
const MEDIAS_SPORT = [
  // Photo à ajouter (src vide = ignorée automatiquement par le site) :
  // { sport: "football", equipe: "rc-gonesse", categorie: "match", src: "", titre: "Victoire à domicile" },
  { sport: "football", equipe: "rc-gonesse", categorie: "media-day", src: "https://picsum.photos/seed/g2/1600/1200", titre: "" },
  { sport: "football", equipe: "rc-gonesse", categorie: "presentation-equipement", src: "https://picsum.photos/seed/g3/1600/1200", titre: "Nouveau maillot", selection: true },

  { sport: "football", equipe: "cergy-pontoise", categorie: "match", src: "https://picsum.photos/seed/c1/1600/1200", titre: "" },
  { sport: "football", equipe: "cergy-pontoise", categorie: "media-day", src: "https://picsum.photos/seed/c2/1600/1200", titre: "" },

  { sport: "football", equipe: "saint-ouen-laumone", categorie: "match", src: "images/soa/DSC05408.jpg", titre: "Victoire à domicile", selection: true },
  { sport: "football", equipe: "saint-ouen-laumone", categorie: "match", src: "images/soa/DSC03241.jpg", titre: "", selection: true },
  { sport: "football", equipe: "saint-ouen-laumone", categorie: "match", src: "images/soa/DSC05128.jpg", titre: "", selection: true },

  { sport: "football", equipe: "fc-pierrelaye", categorie: "match", src: "https://picsum.photos/seed/p1/1600/1200", titre: "" },

  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "https://picsum.photos/seed/a1/1600/1200", titre: "" },

  { sport: "futsal", equipe: "cergy-pontoise", categorie: "media-day", src: "https://picsum.photos/seed/fc1/1600/1200", titre: "" },

  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "https://picsum.photos/seed/j1/1600/1200", titre: "" },

  // Exemple de vidéo (enlève les // pour l'activer) :
  // { sport: "football", equipe: "rc-gonesse", categorie: "media-day", src: "videos/gonesse-media-day.mp4", poster: "images/sport/gonesse-media-day-poster.jpg", titre: "Teaser Media Day" },
];

// ----- Clients (bande « Ils m'ont fait confiance », accueil + page Sport) -----
// nom  : nom du club ou du client (sert aussi de texte alternatif)
// logo : chemin du logo, ex. "images/clients/rc-gonesse.png" ("" = le nom s'affiche à la place)
// lien : site ou Instagram du client ("" = pas de lien)
// Liste vide → la section disparaît.
const CLIENTS = [
  { nom: "[À COMPLÉTER : client 1]", logo: "", lien: "" },
  { nom: "[À COMPLÉTER : client 2]", logo: "", lien: "" },
  { nom: "[À COMPLÉTER : client 3]", logo: "", lien: "" },
];

// ----- Tarifs (« À partir de … € » dans les cartes de prestations) -----
// Mets uniquement le nombre, ex. "150". Laisser "" masque le prix.
const TARIFS = {
  // Page Sport
  "match": "[À COMPLÉTER]",
  "media-day": "[À COMPLÉTER]",
  "presentation-equipement": "[À COMPLÉTER]",
  // Page Shootings
  "evenement": "[À COMPLÉTER]",
  "studio": "[À COMPLÉTER]",
  "restaurant": "[À COMPLÉTER]",
};

// ----- Contenus Shootings -----
const MEDIAS_SHOOTING = [
  { categorie: "anniversaire", src: "https://picsum.photos/seed/an1/1400/1400", titre: "", selection: true },
  { categorie: "studio", src: "https://picsum.photos/seed/st1/1400/1400", titre: "Portrait", selection: true },
  { categorie: "restaurant", src: "https://picsum.photos/seed/re1/1400/1400", titre: "", selection: true },
  { categorie: "anniversaire", src: "https://picsum.photos/seed/an2/1400/1400", titre: "" },
  { categorie: "studio", src: "https://picsum.photos/seed/st2/1000/1500", titre: "" },
  { categorie: "restaurant", src: "https://picsum.photos/seed/re2/1400/1400", titre: "" },
];
