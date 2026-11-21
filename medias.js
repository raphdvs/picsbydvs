// =====================================================
//  MEDIAS.JS : le seul fichier à modifier pour ajouter
//  des équipes, des photos, des vidéos, des clients, des tarifs,
//  des avis, des questions fréquentes et le fil Instagram
// =====================================================

// ----- Images optimisées -----
// true : le site affiche les versions légères de tes photos (chargement bien plus rapide).
// Après avoir ajouté des photos, lance une fois (dans PowerShell, dossier du site) :
//     powershell -ExecutionPolicy Bypass -File optimiser-images.ps1
// Si une version légère manque, la photo d'origine s'affiche quand même.
//
// Convention de nommage (créée par le script, à ne pas écrire à la main) :
//   photo d'origine : images/soa/DSC05408.jpg
//   vignette 800 px : images/soa/opti/DSC05408-800.jpg    (galeries, cartes)
//   grande 2000 px  : images/soa/opti/DSC05408-2000.jpg   (agrandissement, bandeaux)
// Les images en ligne (https://...) et les vidéos ne sont pas concernées.
const IMAGES_OPTIMISEES = true;
// "jpg" avec optimiser-images.ps1 (Windows), "webp" avec optimiser-images.sh (ImageMagick)
const FORMAT_OPTIMISE = "jpg";

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
      "fc-pierrelaye":      { nom: "FC Pierrelaye",          couverture: "images/Pierrelaye/DSC07367.jpg" },
      "fc-versailles":      { nom: "FC Versailles",          couverture: "images/Versailles/DSC03987.jpg" },
    },
  },
  futsal: {
    nom: "Futsal",
    equipes: {
      "paris-acasa":    { nom: "Paris Acasa",    couverture: "images/Paris Acasa/DSC00930.jpg" },
      "cergy-pontoise": { nom: "Cergy-Pontoise", couverture: "https://picsum.photos/seed/cov-fu-cergy/900/700" },
    },
  },
  hockey: {
    nom: "Hockey",
    equipes: {
      "les-jokers": { nom: "Les Jokers", couverture: "images/Jokers/jokers-02.jpg" },
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

// Catégories des pages Événements et Corporate.
// Chaque catégorie devient une partie séparée de la galerie, avec son titre,
// dans l'ordre ci-dessous. Une catégorie sans photo n'apparaît pas.
const CATEGORIES_EVENEMENTS = {
  "anniversaire": "Anniversaires",
  "mariage": "Mariages",
  "soiree": "Soirées",
};

const CATEGORIES_CORPORATE = {
  "bijoux": "Shooting bijoux",
  "restaurant": "Restaurant",
  "studio": "Portraits studio",
};

// ----- Contenus Sport -----
// Une ligne = une photo ou une vidéo.
// ATTENTION aux majuscules : le chemin doit être écrit EXACTEMENT comme le nom
// du fichier (ex. "images/soa/DSC05408.jpg", pas "dsc05408.jpg"), sinon
// l'image marchera sur ton PC mais sera cassée une fois le site en ligne.
// Vidéo : fichier .mp4 ou .webm + "poster" (image affichée avant la lecture).
// selection: true  →  la photo apparaît aussi dans la « Sélection » de l'accueil
//                     (6 à 8 au total, Sport, Événements et Corporate mélangés ; au-delà de 8, les suivantes sont ignorées).
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

  // FC Pierrelaye : photos dans images/Pierrelaye/ (copies web 2000 px)
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC07367.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC00943.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC01238.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC01258.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "match", src: "images/Pierrelaye/DSC04821.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC06268.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC06282-2.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "match", src: "images/Pierrelaye/DSC06778.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC07683.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "match", src: "images/Pierrelaye/DSC08781.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "match", src: "images/Pierrelaye/DSC08846.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC09302.jpg", titre: "" },
  { sport: "football", equipe: "fc-pierrelaye", categorie: "media-day", src: "images/Pierrelaye/DSC09488.jpg", titre: "" },

  // FC Versailles : photos dans images/Versailles/ (copies web 2000 px)
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC03987.jpg", titre: "" },
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC03989.jpg", titre: "" },
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC04019.jpg", titre: "" },
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC04040.jpg", titre: "" },
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC04078.jpg", titre: "" },
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC04127.jpg", titre: "" },
  { sport: "football", equipe: "fc-versailles", categorie: "match", src: "images/Versailles/DSC04178.jpg", titre: "" },

  // Paris Acasa (futsal) : photos dans images/Paris Acasa/ (copies web 2000 px)
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC00930.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC00937.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC00946.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC01165.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC01304.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC01444.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC01909.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC02550.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC03113.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC03600.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC04239.jpg", titre: "" },
  { sport: "futsal", equipe: "paris-acasa", categorie: "match", src: "images/Paris Acasa/DSC04258.jpg", titre: "" },

  { sport: "futsal", equipe: "cergy-pontoise", categorie: "media-day", src: "https://picsum.photos/seed/fc1/1600/1200", titre: "" },

  // Les Jokers (hockey) : photos dans images/Jokers/
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-01.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-02.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-03.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-04.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-05.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-06.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-07.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-08.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-09.jpg", titre: "" },
  { sport: "hockey", equipe: "les-jokers", categorie: "match", src: "images/Jokers/jokers-10.jpg", titre: "" },

  // Exemple de vidéo (enlève les // pour l'activer) :
  // { sport: "football", equipe: "rc-gonesse", categorie: "media-day", src: "videos/gonesse-media-day.mp4", poster: "images/sport/gonesse-media-day-poster.jpg", titre: "Teaser Media Day" },
];

// ----- Clients (bande « Ils m'ont fait confiance », accueil + page Sport) -----
// nom  : nom du club ou du client (sert aussi de texte alternatif)
// logo : chemin du logo, ex. "images/clients/rc-gonesse.png" ("" = le nom s'affiche à la place)
// lien : site ou Instagram du client ("" = pas de lien)
// Liste vide → la section disparaît.
const CLIENTS = [
  { nom: "Cergy Pontoise FC", logo: "", lien: "" },   // CPFC, football
  { nom: "Les Jokers", logo: "", lien: "" },          // hockey
  { nom: "Leslei Bijoux", logo: "", lien: "" },       // shooting bijoux (corporate)
];

// ----- Tarifs (« À partir de … € » dans les cartes de prestations) -----
// Mets uniquement le nombre, ex. "150". Laisser "" masque le prix.
const TARIFS = {
  // Page Sport
  "match": "[À COMPLÉTER]",
  "media-day": "[À COMPLÉTER]",
  "presentation-equipement": "[À COMPLÉTER]",
  // Page Événements
  "evenement": "[À COMPLÉTER]",
  // Page Corporate
  "studio": "[À COMPLÉTER]",
  "restaurant": "[À COMPLÉTER]",
};

// ----- Contenus Événements (anniversaires, mariages, soirées) -----
// categorie : "anniversaire", "mariage" ou "soiree" (voir CATEGORIES_EVENEMENTS)
const MEDIAS_EVENEMENTS = [
  { categorie: "anniversaire", src: "https://picsum.photos/seed/an1/1400/1400", titre: "", selection: true },
  { categorie: "anniversaire", src: "https://picsum.photos/seed/an2/1400/1400", titre: "" },
];

// ----- Contenus Corporate (studio, restaurant) -----
// categorie : "bijoux", "restaurant" ou "studio" (voir CATEGORIES_CORPORATE)
const MEDIAS_CORPORATE = [
  // Shooting studio bijoux : photos dans images/Bijoux/ (copies web 2000 px)
  { categorie: "bijoux", src: "images/Bijoux/DSC00112.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08284.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08441.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08478.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08601.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08684.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08699.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08731.jpg", titre: "", selection: true },
  { categorie: "bijoux", src: "images/Bijoux/DSC08735.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08754.jpg", titre: "" },
  { categorie: "bijoux", src: "images/Bijoux/DSC08776.jpg", titre: "" },

  // Restaurant : photos dans images/Restaurant/ (copies web 2000 px)
  { categorie: "restaurant", src: "images/Restaurant/DSC08489.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08513.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08519.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08526.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08539.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08547.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08581.jpg", titre: "", selection: true },
  { categorie: "restaurant", src: "images/Restaurant/DSC08849.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08974.jpg", titre: "" },
  { categorie: "restaurant", src: "images/Restaurant/DSC08997.jpg", titre: "" },
];

// ----- Avis clients -----
// texte   : l'avis, mot pour mot (2 ou 3 phrases), avec l'accord de la personne
// nom     : prénom + initiale, ou nom du club
// role    : ex. "Président du RC Gonesse", "Mariage, juin 2025" ("" = rien d'affiché)
// univers : "sport" (page Sport), "evenements" (page Événements) ou "corporate" (page Corporate)
//           Tous les avis apparaissent aussi sur l'accueil.
// Liste vide → la section disparaît.
const AVIS = [
  { texte: "[À COMPLÉTER : avis d'un club]", nom: "[À COMPLÉTER : nom]", role: "[À COMPLÉTER : fonction, club]", univers: "sport" },
  { texte: "[À COMPLÉTER : avis d'un club ou d'un joueur]", nom: "[À COMPLÉTER : nom]", role: "", univers: "sport" },
  { texte: "[À COMPLÉTER : avis d'un client événement]", nom: "[À COMPLÉTER : nom]", role: "[À COMPLÉTER : type d'événement]", univers: "evenements" },
  { texte: "[À COMPLÉTER : avis d'un restaurant ou d'une entreprise]", nom: "[À COMPLÉTER : nom]", role: "", univers: "corporate" },
];

// ----- Questions fréquentes (page À propos + page Rendez-vous) -----
// Une ligne = une question. Les réponses s'ouvrent au clic.
// Liste vide → la section disparaît.
const FAQ = [
  { question: "Sous quel délai les photos sont-elles livrées ?", reponse: "[À COMPLÉTER : délai, ex. « sous 48 h après un match, sous 7 jours pour un événement »]" },
  { question: "Combien de photos sont livrées ?", reponse: "[À COMPLÉTER : nombre de photos retouchées selon la prestation]" },
  { question: "Le club peut-il publier les photos sur ses réseaux ?", reponse: "[À COMPLÉTER : droits d'utilisation accordés (réseaux sociaux, site, presse, affiches), mention du crédit @picsbydvs]" },
  { question: "Vous déplacez-vous en dehors du Val-d'Oise ?", reponse: "[À COMPLÉTER : zone couverte et frais de déplacement éventuels]" },
  { question: "Faut-il verser un acompte ?", reponse: "[À COMPLÉTER : montant ou pourcentage de l'acompte, moyens de paiement]" },
];

// ----- Fil Instagram (accueil) -----
// Instagram ne permet pas d'afficher ses publications automatiquement sans service
// payant : ajoute ici à la main tes dernières publications (6 au maximum affichées).
// image : la photo de la publication, déposée dans images/instagram/
// lien  : l'adresse de la publication (Partager → Copier le lien sur Instagram)
// texte : courte description de la photo (sert aux personnes malvoyantes)
// Liste vide → seul le bouton « Suivre @picsbydvs » s'affiche.
const INSTAGRAM_POSTS = [
  // { image: "images/instagram/post-1.jpg", lien: "https://www.instagram.com/p/XXXXXXXXX/", texte: "Célébration après un but" },
];
