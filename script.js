// ===== Réservation (Cal.com) =====
// CAL_UTILISATEUR : ton identifiant Cal.com (cal.com/raphdvs).
// CAL_EVENEMENT   : le type de rendez-vous à afficher directement, c'est la fin de
//                   son lien Cal.com (ex. "devis-20min" pour cal.com/raphdvs/devis-20min).
//                   Vide = la liste de tous tes types de rendez-vous s'affiche.
const CAL_UTILISATEUR = "raphdvs";
const CAL_EVENEMENT = ""; // [À COMPLÉTER : identifiant du type de rendez-vous « devis »]
const BOOKING_URL = "https://cal.com/" + [CAL_UTILISATEUR, CAL_EVENEMENT].filter(Boolean).join("/");

const EMAIL = "devies.raphael7@icloud.com";
const INSTAGRAM = "https://instagram.com/picsbydvs";
const LINKEDIN = "https://www.linkedin.com/in/rapha%C3%ABl-devies-6a875b283/";

// ===== Menu et pied de page (communs à toutes les pages) =====
const page = document.body.dataset.page;
const links = [
  ["index.html", "Accueil", "accueil"],
  ["sport.html", "Sport", "sport"],
  ["evenements.html", "Événements", "evenements"],
  ["corporate.html", "Corporate", "corporate"],
  ["a-propos.html", "À propos", "a-propos"],
];

document.getElementById("site-header").innerHTML = `
  <a class="brand" href="index.html">
    <img src="images/logo-blanc.png" alt="" width="40" height="40">
    <span>Raphaël</span>
  </a>
  <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <nav>
    ${links.map(([href, label, id]) =>
      `<a href="${href}" ${id === page ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
    <a class="btn" href="rendez-vous.html">Demander un devis</a>
  </nav>`;

document.getElementById("site-footer").innerHTML = `
  © ${new Date().getFullYear()} Raphaël, photographe ·
  <a href="${INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram @picsbydvs">@picsbydvs</a> ·
  <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a> ·
  <a href="mailto:${EMAIL}">${EMAIL}</a> ·
  <a href="mentions-legales.html">Mentions légales</a>`;

document.querySelectorAll("[data-email]").forEach(a => {
  a.href = "mailto:" + EMAIL;
  a.textContent = EMAIL;
});

// ===== Menu mobile =====
const burger = document.querySelector(".burger");
const nav = document.querySelector(".site-header nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});

// ===== Outils =====
const estVideo = src => /\.(mp4|webm)$/i.test(src);
const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;
const lienEquipe = (sportId, equipeId) => `equipe.html?sport=${sportId}&equipe=${equipeId}`;
// Un média sans "src" (ou avec un src vide) est ignoré partout
const aUneSource = m => typeof m.src === "string" && m.src.trim() !== "";
const mediasEquipe = (sportId, equipeId) =>
  MEDIAS_SPORT.filter(m => aUneSource(m) && m.sport === sportId && m.equipe === equipeId);

// Versions optimisées des photos (voir IMAGES_OPTIMISEES dans medias.js)
// images/soa/DSC05408.jpg → images/soa/opti/DSC05408-800.webp
const optimisees = typeof IMAGES_OPTIMISEES !== "undefined" && IMAGES_OPTIMISEES;
function versionOptimisee(src, taille) {
  if (!optimisees || !src || estVideo(src) || /^(https?:)?\/\//i.test(src)) return src;
  const i = src.lastIndexOf("/");
  const nom = src.slice(i + 1).replace(/\.[^.]+$/, "");
  return `${src.slice(0, i + 1)}opti/${nom}-${taille}.webp`;
}
const vignette = src => versionOptimisee(src, 800);
const grande = src => versionOptimisee(src, 2000);

// Libellés et textes alternatifs
const nomEquipe = m => (SPORTS[m.sport] && SPORTS[m.sport].equipes[m.equipe] || {}).nom || "";
const categorieSport = m => CATEGORIES_SPORT[m.categorie] || "";
// Événements et Corporate : chaque média garde la trace de sa page ("univers")
const listeEvenements = (typeof MEDIAS_EVENEMENTS !== "undefined" ? MEDIAS_EVENEMENTS : [])
  .map(m => ({ ...m, univers: "evenements" }));
const listeCorporate = (typeof MEDIAS_CORPORATE !== "undefined" ? MEDIAS_CORPORATE : [])
  .map(m => ({ ...m, univers: "corporate" }));
const categoriePro = m => {
  const categories = m.univers === "evenements"
    ? (typeof CATEGORIES_EVENEMENTS !== "undefined" ? CATEGORIES_EVENEMENTS : {})
    : (typeof CATEGORIES_CORPORATE !== "undefined" ? CATEGORIES_CORPORATE : {});
  return categories[m.categorie] || "";
};
const altSport = m => [nomEquipe(m), categorieSport(m)].filter(Boolean).join(" — ");
const altPro = m => [m.univers === "evenements" ? "Événement" : "Corporate", categoriePro(m)].filter(Boolean).join(" — ");

// Couverture d'une équipe : celle de medias.js, sinon sa première photo
function couvertureEquipe(sportId, equipeId, taille) {
  const equipe = SPORTS[sportId].equipes[equipeId];
  if (equipe.couverture) return taille(equipe.couverture);
  const photo = mediasEquipe(sportId, equipeId).find(m => !estVideo(m.src));
  return photo ? taille(photo.src) : "";
}
const styleFond = url => url ? ` style="--img:url('${url}')"` : "";

// « 3 photos · 1 vidéo », sans jamais afficher de zéro
function compteur(medias) {
  const videos = medias.filter(m => estVideo(m.src)).length;
  const photos = medias.length - videos;
  const parts = [];
  if (photos) parts.push(pluriel(photos, "photo"));
  if (videos) parts.push(pluriel(videos, "vidéo"));
  return parts.join(" · ") || "Bientôt en ligne";
}

// Carte cliquable d'une équipe
function carteEquipe(sportId, equipeId) {
  const sport = SPORTS[sportId];
  const equipe = sport.equipes[equipeId];
  return `
    <a class="team" href="${lienEquipe(sportId, equipeId)}"${styleFond(couvertureEquipe(sportId, equipeId, vignette))}>
      <span class="team-sport">${sport.nom}</span>
      <h3>${equipe.nom}</h3>
      <span class="team-count">${compteur(mediasEquipe(sportId, equipeId))}</span>
    </a>`;
}

// Transforme une liste de catégories en filtres (+ filtre "Vidéos")
function filtresDepuis(categories) {
  const filtres = {};
  Object.entries(categories).forEach(([id, nom]) => {
    filtres[id] = { nom, test: m => m.categorie === id };
  });
  filtres.videos = { nom: "Vidéos", test: m => estVideo(m.src) };
  return filtres;
}

// ===== Visionneuse (lightbox) =====
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Visionneuse");
lightbox.setAttribute("aria-hidden", "true");
lightbox.innerHTML = `
  <button type="button" class="lb-btn lb-close" aria-label="Fermer">×</button>
  <button type="button" class="lb-btn lb-prev" aria-label="Média précédent">‹</button>
  <figure class="lb-figure">
    <div class="lb-media"></div>
    <figcaption class="lb-legende">
      <span class="lb-texte"></span>
      <span class="lb-compteur" aria-live="polite"></span>
    </figcaption>
  </figure>
  <button type="button" class="lb-btn lb-next" aria-label="Média suivant">›</button>`;
document.body.append(lightbox);

const lb = {
  media: lightbox.querySelector(".lb-media"),
  texte: lightbox.querySelector(".lb-texte"),
  compteur: lightbox.querySelector(".lb-compteur"),
  close: lightbox.querySelector(".lb-close"),
  prev: lightbox.querySelector(".lb-prev"),
  next: lightbox.querySelector(".lb-next"),
  liste: [],   // médias parcourables : [{ m, legende, alt }]
  index: 0,
  retour: null // vignette à laquelle rendre le focus
};
const lightboxOuverte = () => lightbox.classList.contains("open");

function arreterVideo() {
  const v = lb.media.querySelector("video");
  if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
}

function afficherMedia() {
  const { m, legende, alt } = lb.liste[lb.index];
  arreterVideo();
  lb.media.innerHTML = estVideo(m.src)
    ? `<video src="${m.src}" ${m.poster ? `poster="${m.poster}"` : ""} controls autoplay playsinline aria-label="${alt}"></video>`
    : `<img src="${grande(m.src)}" alt="${alt}">`;
  lb.texte.innerHTML = (m.titre ? `<strong>${m.titre}</strong>` : "") + legende;
  const plusieurs = lb.liste.length > 1;
  lb.compteur.textContent = plusieurs ? `${lb.index + 1} / ${lb.liste.length}` : "";
  lb.prev.hidden = lb.next.hidden = !plusieurs;
}

function ouvrirLightbox(liste, index, declencheur) {
  lb.liste = liste;
  lb.index = Math.max(0, index);
  lb.retour = declencheur;
  afficherMedia();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lb.close.focus();
}

function fermerLightbox() {
  if (!lightboxOuverte()) return;
  arreterVideo();
  lb.media.innerHTML = "";
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lb.retour) lb.retour.focus();
}

function naviguer(sens) {
  const n = lb.liste.length;
  if (n < 2) return;
  lb.index = (lb.index + sens + n) % n;
  afficherMedia();
}

lb.close.addEventListener("click", fermerLightbox);
lb.prev.addEventListener("click", () => naviguer(-1));
lb.next.addEventListener("click", () => naviguer(1));
// Clic sur le fond sombre = fermer
lightbox.addEventListener("click", e => {
  if (e.target === lightbox || e.target.classList.contains("lb-figure") || e.target === lb.media) fermerLightbox();
});

document.addEventListener("keydown", e => {
  if (!lightboxOuverte()) return;
  if (e.key === "Escape") fermerLightbox();
  else if (e.key === "ArrowLeft") naviguer(-1);
  else if (e.key === "ArrowRight") naviguer(1);
  else if (e.key === "Tab") {
    // Le focus reste dans la visionneuse
    const focusables = [...lightbox.querySelectorAll("button, video")].filter(el => !el.hidden);
    const premier = focusables[0], dernier = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  }
});

// Swipe gauche/droite sur mobile (pas sur les commandes d'une vidéo)
let toucheX = null, toucheY = null;
lightbox.addEventListener("touchstart", e => {
  if (e.target.tagName === "VIDEO") { toucheX = null; return; }
  toucheX = e.changedTouches[0].clientX;
  toucheY = e.changedTouches[0].clientY;
}, { passive: true });
lightbox.addEventListener("touchend", e => {
  if (toucheX === null) return;
  const dx = e.changedTouches[0].clientX - toucheX;
  const dy = e.changedTouches[0].clientY - toucheY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) naviguer(dx < 0 ? 1 : -1);
  toucheX = null;
});

// ===== Galerie en mosaïque, avec filtres facultatifs =====
// options : filtres (ou null), legende(m) = texte sous la photo, alt(m) = texte alternatif
function creerGalerie(conteneur, medias, { filtres = null, legende = () => "", alt = legende } = {}) {
  const barre = document.createElement("div");
  barre.className = "filters";
  const grille = document.createElement("div");
  grille.className = "gallery";
  const vide = document.createElement("p");
  vide.className = "vide";
  // Pages Sport/équipe au tutoiement, les autres au vouvoiement
  vide.textContent = page === "sport"
    ? "Pas encore de contenu ici, reviens bientôt !"
    : "Pas encore de contenu ici, revenez bientôt !";
  if (filtres) conteneur.append(barre);
  conteneur.append(grille, vide);

  // Vignettes
  const elements = medias.map(m => {
    const video = estVideo(m.src);
    const texteAlt = alt(m);
    const a = document.createElement("a");
    a.className = "item" + (video ? " is-video" : "");
    a.href = video ? m.src : grande(m.src);
    const apercu = video
      ? (m.poster
          ? `<img src="${m.poster}" alt="${texteAlt}" loading="lazy" decoding="async">`
          : `<video src="${m.src}#t=0.5" muted playsinline preload="metadata" aria-label="${texteAlt}"></video>`)
      : `<img src="${vignette(m.src)}" alt="${texteAlt}" loading="lazy" decoding="async">`;
    const texte = (m.titre ? `<strong>${m.titre}</strong>` : "") + legende(m);
    a.innerHTML = apercu + (texte ? `<span>${texte}</span>` : "");
    a.addEventListener("click", e => {
      e.preventDefault();
      // La visionneuse ne parcourt que les médias visibles (filtre actif)
      const visibles = elements.filter(el => !el.a.classList.contains("hidden"));
      ouvrirLightbox(
        visibles.map(el => ({ m: el.m, legende: legende(el.m), alt: alt(el.m) })),
        visibles.findIndex(el => el.a === a),
        a
      );
    });
    grille.append(a);
    return { m, a };
  });

  const options = { tout: { nom: "Tout", test: () => true }, ...(filtres || {}) };
  const compte = id => elements.filter(({ m }) => options[id].test(m)).length;

  // Filtre de départ lu dans l'adresse (ex. #filtre=match)
  let actif = filtres ? new URLSearchParams(location.hash.slice(1)).get("filtre") : "tout";
  if (!(actif in options) || !compte(actif)) actif = "tout";

  function afficher() {
    // Boutons (ceux sans contenu sont masqués)
    if (filtres) {
      barre.innerHTML = "";
      Object.entries(options).forEach(([id, f]) => {
        const n = compte(id);
        if (!n && id !== "tout") return;
        const b = document.createElement("button");
        b.type = "button";
        b.innerHTML = `${f.nom} <small>${n}</small>`;
        b.classList.toggle("active", id === actif);
        b.setAttribute("aria-pressed", id === actif);
        b.addEventListener("click", () => { actif = id; afficher(); });
        barre.append(b);
      });
    }

    // Vignettes visibles
    let visibles = 0;
    elements.forEach(({ m, a }) => {
      const ok = options[actif].test(m);
      a.classList.toggle("hidden", !ok);
      if (ok) visibles++;
    });
    vide.hidden = visibles > 0;

    // Adresse partageable
    if (filtres) {
      history.replaceState(null, "", location.pathname + location.search + (actif === "tout" ? "" : "#filtre=" + actif));
    }
  }

  afficher();
}

// ===== Bandeaux avec photo (data-fond) : version optimisée si disponible =====
document.querySelectorAll("[data-fond]").forEach(el => {
  el.style.setProperty("--img", `url('${grande(el.dataset.fond)}')`);
});

// ===== Accueil : Sélection =====
const blocSelection = document.getElementById("selection");
if (blocSelection) {
  const choisies = liste => liste.filter(m => m.selection && aUneSource(m));
  const groupes = [choisies(MEDIAS_SPORT), choisies(listeEvenements), choisies(listeCorporate)];
  // On alterne Sport / Événements / Corporate, 8 au maximum
  const melange = [];
  for (let i = 0; i < Math.max(...groupes.map(g => g.length)); i++) {
    groupes.forEach(g => { if (g[i]) melange.push(g[i]); });
  }
  if (!melange.length) {
    blocSelection.closest("section").hidden = true;
  } else {
    creerGalerie(blocSelection, melange.slice(0, 8), {
      legende: m => m.sport ? nomEquipe(m) : categoriePro(m),
      alt: m => m.sport ? altSport(m) : altPro(m)
    });
  }
}

// ===== Bande « Ils m'ont fait confiance » (accueil + Sport) =====
document.querySelectorAll("[data-clients]").forEach(liste => {
  const clients = typeof CLIENTS !== "undefined" ? CLIENTS.filter(c => c.nom) : [];
  if (!clients.length) { liste.closest("section").hidden = true; return; }
  liste.innerHTML = clients.map(c => {
    const contenu = c.logo
      ? `<img src="${c.logo}" alt="${c.nom}" loading="lazy" decoding="async">`
      : `<span>${c.nom}</span>`;
    return c.lien
      ? `<a class="client" href="${c.lien}" target="_blank" rel="noopener">${contenu}</a>`
      : `<div class="client">${contenu}</div>`;
  }).join("");
});

// ===== Repères de prix (TARIFS dans medias.js) =====
document.querySelectorAll("[data-tarif]").forEach(el => {
  const prix = typeof TARIFS !== "undefined" ? String(TARIFS[el.dataset.tarif] || "").trim() : "";
  if (prix) el.textContent = `À partir de ${prix} €`;
  else el.hidden = true;
});

// ===== Avis clients (AVIS dans medias.js) =====
// data-avis="sport" | "evenements" | "corporate" | "tous"
document.querySelectorAll("[data-avis]").forEach(liste => {
  const univers = liste.dataset.avis;
  const avis = (typeof AVIS !== "undefined" ? AVIS : [])
    .filter(a => a.texte && (univers === "tous" || a.univers === univers));
  if (!avis.length) { liste.closest("section").hidden = true; return; }
  liste.innerHTML = avis.map(a => `
    <figure class="avis">
      <blockquote><p>${a.texte}</p></blockquote>
      <figcaption><strong>${a.nom}</strong>${a.role ? `<span>${a.role}</span>` : ""}</figcaption>
    </figure>`).join("");
});

// ===== Questions fréquentes (FAQ dans medias.js) =====
// <details> : accordéon natif, accessible au clavier sans code supplémentaire
document.querySelectorAll("[data-faq]").forEach(liste => {
  const faq = (typeof FAQ !== "undefined" ? FAQ : []).filter(q => q.question);
  if (!faq.length) { liste.closest("section").hidden = true; return; }
  liste.innerHTML = faq.map(q => `
    <details>
      <summary>${q.question}</summary>
      <p>${q.reponse}</p>
    </details>`).join("");
});

// ===== Fil Instagram (INSTAGRAM_POSTS dans medias.js), 6 au maximum =====
document.querySelectorAll("[data-instagram]").forEach(grille => {
  const posts = (typeof INSTAGRAM_POSTS !== "undefined" ? INSTAGRAM_POSTS : [])
    .filter(p => p.image).slice(0, 6);
  if (!posts.length) { grille.hidden = true; return; }
  grille.innerHTML = posts.map(p => `
    <a href="${p.lien || INSTAGRAM}" target="_blank" rel="noopener">
      <img src="${vignette(p.image)}" alt="${p.texte || "Publication Instagram de @picsbydvs"}" loading="lazy" decoding="async">
    </a>`).join("");
});
document.querySelectorAll("[data-instagram-lien]").forEach(a => { a.href = INSTAGRAM; });

// ===== Page Sport : liste des équipes =====
const listeEquipes = document.getElementById("equipes");
if (listeEquipes) {
  listeEquipes.innerHTML = `
    <nav class="sport-nav" aria-label="Aller au sport">
      ${Object.entries(SPORTS).map(([id, s]) => `<a href="#${id}">${s.nom}</a>`).join("")}
    </nav>
    ${Object.entries(SPORTS).map(([sportId, sport]) => `
      <div class="sport-bloc" id="${sportId}">
        <h2>${sport.nom}</h2>
        <div class="teams">
          ${Object.keys(sport.equipes).map(equipeId => carteEquipe(sportId, equipeId)).join("")}
        </div>
      </div>`).join("")}`;
}

// ===== Page Équipe =====
// Met à jour (ou crée) une balise <meta> du <head>
function majMeta(attribut, cle, valeur) {
  let meta = document.head.querySelector(`meta[${attribut}="${cle}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribut, cle);
    document.head.append(meta);
  }
  meta.setAttribute("content", valeur);
}

const pageEquipe = document.getElementById("page-equipe");
if (pageEquipe) {
  const params = new URLSearchParams(location.search);
  const sportId = params.get("sport");
  const equipeId = params.get("equipe");
  const sport = SPORTS[sportId];
  const equipe = sport && sport.equipes[equipeId];

  if (!equipe) {
    pageEquipe.innerHTML = `
      <section class="section">
        <h1>Équipe introuvable</h1>
        <p class="lead">Cette page n'existe pas ou a été déplacée.</p>
        <a class="btn" href="sport.html">Voir toutes les équipes</a>
      </section>`;
  } else {
    // Titre, description et aperçu de partage propres à l'équipe
    const titre = `${equipe.nom} (${sport.nom}) — Raphaël, photographe`;
    const description = `${equipe.nom} en photos et vidéos : matchs, Media Day et présentations d'équipement, par Raphaël, photographe ${sport.nom.toLowerCase()}.`;
    const image = couvertureEquipe(sportId, equipeId, grande);
    document.title = titre;
    majMeta("name", "description", description);
    majMeta("property", "og:title", titre);
    majMeta("property", "og:description", description);
    majMeta("property", "og:url", location.href);
    majMeta("name", "twitter:title", titre);
    majMeta("name", "twitter:description", description);
    if (image) {
      const absolue = new URL(image, location.href).href;
      majMeta("property", "og:image", absolue);
      majMeta("name", "twitter:image", absolue);
    }

    // Les autres équipes, pour continuer la visite
    const autres = Object.entries(SPORTS).flatMap(([sId, s]) =>
      Object.keys(s.equipes)
        .filter(eId => !(sId === sportId && eId === equipeId))
        .map(eId => carteEquipe(sId, eId)));

    pageEquipe.innerHTML = `
      <section class="hero"${styleFond(couvertureEquipe(sportId, equipeId, grande))}>
        <nav class="fil" aria-label="Fil d'Ariane">
          <a href="sport.html">Sport</a> › <a href="sport.html#${sportId}">${sport.nom}</a> › <span>${equipe.nom}</span>
        </nav>
        <p class="kicker">${sport.nom}</p>
        <h1>${equipe.nom}</h1>
      </section>

      <section class="section">
        <div id="galerie-equipe"></div>
      </section>

      <section class="cta-band">
        <h2>Ton club aussi ?</h2>
        <p>Media Day, matchs, présentation d'équipement : parlons-en.</p>
        <a class="btn" href="rendez-vous.html">Prendre rendez-vous</a>
      </section>

      <section class="section">
        <h2>Autres équipes</h2>
        <div class="teams">${autres.join("")}</div>
      </section>`;

    // Galerie épurée : ni filtres ni catégorie affichée (seul un éventuel "titre" apparaît)
    creerGalerie(document.getElementById("galerie-equipe"), mediasEquipe(sportId, equipeId), {
      legende: () => "",
      alt: altSport
    });
  }
}

// ===== Pages Événements et Corporate : une galerie par catégorie, avec son titre =====
// (ordre et titres : CATEGORIES_EVENEMENTS / CATEGORIES_CORPORATE dans medias.js ;
//  la visionneuse reste dans la série ouverte, sans mélanger bijoux et restaurant)
[
  ["evenements", listeEvenements, typeof CATEGORIES_EVENEMENTS !== "undefined" ? CATEGORIES_EVENEMENTS : {}],
  ["corporate", listeCorporate, typeof CATEGORIES_CORPORATE !== "undefined" ? CATEGORIES_CORPORATE : {}],
].forEach(([nom, liste, categories]) => {
  const galerie = document.querySelector(`[data-galerie="${nom}"]`);
  if (!galerie) return;
  const medias = liste.filter(aUneSource);

  // Regroupement par catégorie ; une catégorie inconnue va dans « Autres »
  const series = Object.entries(categories)
    .map(([id, titre]) => ({ id, titre, medias: medias.filter(m => m.categorie === id) }));
  const autres = medias.filter(m => !(m.categorie in categories));
  if (autres.length) series.push({ id: "autres", titre: "Autres", medias: autres });
  const pleines = series.filter(s => s.medias.length);

  if (!pleines.length) { creerGalerie(galerie, [], { alt: altPro }); return; }

  // Raccourcis vers chaque série (seulement s'il y en a plusieurs)
  if (pleines.length > 1) {
    galerie.insertAdjacentHTML("beforeend", `
      <nav class="sport-nav series-nav" aria-label="Aller à la série">
        ${pleines.map(s => `<a href="#serie-${s.id}">${s.titre}</a>`).join("")}
      </nav>`);
  }
  pleines.forEach(s => {
    const bloc = document.createElement("div");
    bloc.className = "serie";
    bloc.id = `serie-${s.id}`;
    bloc.innerHTML = `<h3 class="serie-titre">${s.titre}</h3>`;
    galerie.append(bloc);
    creerGalerie(bloc, s.medias, { legende: () => "", alt: altPro });
  });
});

// ===== Apparition douce au défilement (fondu + légère montée) =====
// Désactivée si la personne a demandé à réduire les animations sur son appareil.
// Sans JavaScript, tout reste visible (la classe "anime" n'est jamais ajoutée).
const animationsReduites = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!animationsReduites && "IntersectionObserver" in window) {
  document.documentElement.classList.add("anime");
  const observateur = new IntersectionObserver((entrees, obs) => {
    entrees.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("visible");
      obs.unobserve(el);
      // Animation terminée : on rend à l'élément ses effets de survol habituels
      setTimeout(() => {
        el.classList.remove("apparition", "visible");
        el.style.removeProperty("--delai");
      }, 1000);
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  const cibles = document.querySelectorAll(
    ".gallery .item, .team, .card, .avis, .insta-grille a, .steps li, .about img, .faq details, .client"
  );
  // Léger décalage entre éléments voisins (effet « cascade »)
  cibles.forEach((el, i) => {
    el.classList.add("apparition");
    el.style.setProperty("--delai", `${(i % 4) * 80}ms`);
    observateur.observe(el);
  });
}

// ===== Agenda de réservation : intégration officielle Cal.com (inline embed) =====
const booking = document.getElementById("booking");
if (booking) {
  if (!CAL_UTILISATEUR) {
    booking.innerHTML = `<p class="notice">Agenda pas encore relié : indiquez votre identifiant dans <code>script.js</code>, ligne <code>CAL_UTILISATEUR</code>.</p>`;
  } else {
    // Lien de secours, visible tant que l'agenda charge (ou si Cal.com est injoignable)
    booking.innerHTML = `<p class="booking-secours">Chargement de l'agenda… Si rien ne s'affiche,
      <a href="${BOOKING_URL}" target="_blank" rel="noopener">ouvrez l'agenda dans un nouvel onglet</a>.</p>`;

    // --- Code d'intégration fourni par Cal.com (ne pas modifier) ---
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    // --- Fin du code Cal.com ---

    Cal("init", "devis", { origin: "https://app.cal.com" });
    Cal.ns.devis("inline", {
      elementOrSelector: "#booking",
      calLink: [CAL_UTILISATEUR, CAL_EVENEMENT].filter(Boolean).join("/"),
      config: { layout: "month_view", theme: "light" }
    });
    // Aux couleurs du site
    Cal.ns.devis("ui", {
      theme: "light",
      cssVarsPerTheme: { light: { "cal-brand": "#034C8C", "cal-brand-emphasis": "#123A5B", "cal-brand-text": "#FFFFFF" } },
      hideEventTypeDetails: false,
      layout: "month_view"
    });
    // Une fois l'agenda affiché, on retire le message de chargement
    Cal.ns.devis("on", {
      action: "linkReady",
      callback: () => { const s = booking.querySelector(".booking-secours"); if (s) s.remove(); }
    });
  }
}
