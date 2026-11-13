// =====================================================
//  MEDIAS.JS : chargement du contenu du site
// =====================================================
//
// Le contenu (photos, équipes, clients, tarifs) n'est plus écrit ici :
// il se trouve dans le dossier « contenu/ » et se modifie SANS CODE
// depuis Pages CMS (https://app.pagescms.org, connexion avec GitHub).
//
//   contenu/photos-sport.json      → photos et vidéos des équipes
//   contenu/photos-shootings.json  → photos et vidéos des shootings
//   contenu/equipes.json           → sports, équipes et couvertures
//   contenu/categories.json        → catégories (filtres des galeries)
//   contenu/clients.json           → bande « Ils m'ont fait confiance »
//   contenu/tarifs.json            → prix « À partir de … € »
//
// Ce fichier lit ces fichiers et les met à disposition de script.js.
// Tu n'as normalement plus besoin de le modifier.

// ----- Images optimisées (WebP) -----
// Laisse sur false tant que tu n'as pas lancé optimiser-images.sh.
// Une fois le script lancé, passe à true : le site utilisera alors
// automatiquement les versions légères de tes photos.
//   photo d'origine : images/soa/DSC05408.jpg
//   vignette 800 px : images/soa/opti/DSC05408-800.webp   (galeries, cartes)
//   grande 2000 px  : images/soa/opti/DSC05408-2000.webp  (agrandissement, bandeaux)
const IMAGES_OPTIMISEES = false;

// ----- Données remplies au chargement (ne pas modifier) -----
let SPORTS = {};
let CATEGORIES_SPORT = {};
let CATEGORIES_SHOOTING = {};
let MEDIAS_SPORT = [];
let MEDIAS_SHOOTING = [];
let CLIENTS = [];
let TARIFS = {};

// "no-cache" : le navigateur vérifie à chaque visite s'il existe une version plus récente
const lireJSON = fichier =>
  fetch("contenu/" + fichier, { cache: "no-cache" }).then(r => {
    if (!r.ok) throw new Error(fichier + " : " + r.status);
    return r.json();
  });

// Une entrée de Pages CMS → le format utilisé par script.js.
// Vidéo : le champ "video" contient le fichier .mp4, et "src" devient son aperçu (poster).
function versMedia(p) {
  const m = { ...p };
  if (p.video) { m.src = p.video; m.poster = p.src || ""; }
  if (p.equipe) [m.sport, m.equipe] = p.equipe.split("/");
  return m;
}

const listeVersObjet = liste => Object.fromEntries((liste || []).map(c => [c.id, c.nom]));

const CONTENU_PRET = Promise.all([
  lireJSON("equipes.json"),
  lireJSON("categories.json"),
  lireJSON("photos-sport.json"),
  lireJSON("photos-shootings.json"),
  lireJSON("clients.json"),
  lireJSON("tarifs.json"),
]).then(([equipes, categories, sport, shootings, clients, tarifs]) => {
  (equipes.sports || []).forEach(s => {
    SPORTS[s.id] = {
      nom: s.nom,
      equipes: Object.fromEntries((s.equipes || []).map(e => [e.id, { nom: e.nom, couverture: e.couverture || "" }])),
    };
  });
  CATEGORIES_SPORT = listeVersObjet(categories.sport);
  CATEGORIES_SHOOTING = listeVersObjet(categories.shootings);
  MEDIAS_SPORT = (sport.photos || []).map(versMedia);
  MEDIAS_SHOOTING = (shootings.photos || []).map(versMedia);
  CLIENTS = clients.clients || [];
  TARIFS = tarifs || {};
});
