---
name: product-3d-scroll-site
description: Crée un site produit 3D scrollytelling en un seul fichier HTML (three.js + GSAP ScrollTrigger) avec voix off, sous-titres, visite guidée automatique, particules et version mobile. À utiliser quand l'utilisateur veut une animation 3D de produit (canette, bouteille, flacon, pot...) qui bouge au défilement, un site vitrine 3D de marque, ou "le même principe que B'ssap".
---

# Site produit 3D au scroll

Modèle de référence : `template.html` (dans ce dossier) = le site B'ssap complet et testé. Pars toujours de ce fichier plutôt que de réécrire de zéro, puis adapte-le.

## Étapes

1. **Cadrer** (une seule question groupée si des infos manquent) : produit, nom de marque, palette, liste des scènes (6 à 8), textes réels, images/logo, langue de la voix off. Sans réponse, prends des valeurs par défaut et signale-les comme provisoires.
2. **Copier** `template.html` vers le dossier du projet (ex. `<marque>-site/index.html`).
3. **Adapter**, dans cet ordre :
   - `VO` (phrases de la voix off) et `BG` (couleurs de fond par scène).
   - `<section data-i="N">` : un bloc de texte par scène, classes `left` / `right` / `center`.
   - `makeLabelTexture` : étiquette dessinée en canvas 2D, ou `THREE.TextureLoader` avec l'image fournie.
   - Géométrie du produit : profil `LatheGeometry` pour une bouteille/pot, ou chargement `.glb` avec `GLTFLoader` ajouté au groupe `can`.
   - `poses(i)` : une pose par scène (`x, y, ry, rx, rz, s, spin`, plus les états de scène éventuels). C'est la chorégraphie.
   - `activate(i)` : événements propres à une scène (sons, compteurs, ouverture, service).
4. **Vérifier** avec Playwright (Chromium est préinstallé) : le CDN est bloqué dans le bac à sable, donc installer `three@0.128.0` et `gsap@3.12.2` avec npm dans le dossier temporaire, remplacer les URL du CDN par des chemins `file://` dans une copie de test, lancer avec `--use-gl=swiftshader --enable-unsafe-swiftshader`, capturer chaque scène sur bureau (1280x720) ET mobile (390x800), corriger cadrage et chevauchements.
5. **Livrer** : publier avec l'outil Artifact (garder l'URL pour les mises à jour), envoyer le `index.html` avec SendUserFile, committer et pousser sur la branche désignée. Dire honnêtement ce qui n'a pas pu être testé (voix, sons, photos externes).

## Règles apprises (à respecter)

- **Voix off** : `speechSynthesis` n'existe pas dans le navigateur intégré de l'app Claude et sonne robotisé ailleurs. Toujours proposer de vraies voix (ElevenLabs, un mp3 par scène, lecture avec `new Audio()`), garder les sous-titres. Après `speechSynthesis.cancel()`, attendre ~300 ms avant de reparler, et lire phrase par phrase. Les générations gratuites ElevenLabs peuvent être saturées : ne pas relancer en boucle, ne pas facturer.
- **Autoplay** : la voix et les sons ne démarrent qu'après un clic (écran d'entrée « Visite guidée avec voix off » / « Explorer en silence »).
- **Sous-titres** : `width:max-content` + `max-width`, sinon ils s'écrasent en colonne étroite.
- **Mobile** : texte en bas, produit en haut (`offY`, échelle réduite, caméra plus loin) ; tester les poses les plus larges (service/versement).
- **Contenu inventé** (chiffres nutritionnels, équipements, noms, boutons sans lien) : le signaler clairement à l'utilisateur pour remplacement.
- **Images web** : n'utiliser que des sources libres de droits (Pexels, Unsplash), créditer, et dire que ce sont des images d'illustration.
- Un seul fichier HTML, bibliothèques depuis cdnjs avec versions figées : three r128, GSAP 3.12.2 (+ ScrollTrigger).
