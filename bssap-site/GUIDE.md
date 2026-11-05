# Créer un site produit 3D qui s'anime au scroll (comme B'ssap)

Le fichier `index.html` est le script complet. Il est autonome : un seul fichier, aucune installation. Il charge trois bibliothèques depuis internet :

| Rôle | Bibliothèque |
|---|---|
| Rendu 3D (la canette, le verre, les pétales) | three.js r128 |
| Animations et transitions | GSAP 3.12 |
| Animations liées au défilement | GSAP ScrollTrigger |

## 1. Le principe en 5 idées

1. **Un seul décor 3D fixe** (`<canvas>` plein écran) derrière le texte.
2. **Une section HTML de 100 vh par scène.** L'utilisateur défile, une section devient « active ».
3. **Une pose par section.** Une pose est un objet : position `x, y`, rotations `ry, rx, rz`, taille `s`, etc. Quand la section s'active, GSAP anime la canette vers cette pose.
4. **Une boucle de rendu** qui lit l'état courant et l'applique aux objets 3D à chaque image.
5. **Voix off et sous-titres** déclenchés par la section active, avec une visite guidée qui défile toute seule.

## 2. Les blocs du fichier (dans l'ordre)

| Bloc | Ce qu'il fait | À modifier pour un autre produit |
|---|---|---|
| `VO` et `BG` | Texte de la voix off et couleurs de fond par section | Tes phrases et tes couleurs |
| `makeLabelTexture` | Dessine l'étiquette (logo, fleur, tableau nutritionnel) sur un canvas 2D | Ton design, ou une vraie image : `new THREE.TextureLoader().load('etiquette.png')` |
| Environnement studio | Crée les reflets sur le métal avec des « softboxes » | Rarement |
| Géométrie de la canette | `CylinderGeometry` pour le corps, `LatheGeometry` pour le haut et le fond, `ExtrudeGeometry` pour la languette | Remplace par un modèle `.glb` (voir plus bas) |
| Verre, liquide, glaçons, filet | Scène de service | Supprime si inutile |
| Pétales | `InstancedMesh` de 80 pétales qui tombent | Change la forme et les couleurs |
| `poses(i)` | **Le cœur de l'animation** : une pose par section | Ta chorégraphie |
| `go(i)` | Anime l'état vers la pose avec GSAP | Rarement |
| `speak()` | Voix off par phrases, avec délai de sécurité | Remplace par des fichiers audio (voir plus bas) |
| `activate(i)` | Ce qui se passe quand une section devient active : texte, fond, voix, sons | Ton scénario |
| `renderer.setAnimationLoop` | Applique l'état aux objets 3D à chaque image | Si tu ajoutes des objets |

## 3. Écrire ta propre chorégraphie

Chaque pose est une ligne :

```js
{ x: -R, y: 0, ry: .35, rx: 0, rz: 0, s: M, spin: 0, tab: 0, pour: 0, level: 0, glass: 0, shadow: 1 }
```

- `x, y` : position (négatif = gauche). `R` est le décalage latéral calculé selon l'écran.
- `ry` : rotation autour de l'axe vertical (0 = face, `Math.PI` = dos).
- `rx` : inclinaison avant/arrière (`1.05` = vue de dessus).
- `rz` : bascule sur le côté (`-2` = canette penchée pour verser).
- `s` : taille. `spin` : 1 = rotation continue, 0 = fixe.

Pour ajouter une scène : ajoute une `<section data-i="N">` dans le HTML, une ligne dans `VO`, une dans `BG`, une dans `poses`.

## 4. Remplacer la canette par ton produit

- **Modèle 3D réel (le plus réaliste)** : exporte ton produit en `.glb` (Blender, Spline, Sketchfab), puis :
  ```html
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  ```
  ```js
  new THREE.GLTFLoader().load('produit.glb', g => can.add(g.scene));
  ```
  Garde le groupe `can` : toutes les poses continuent de fonctionner.
- **Autre forme simple** : change les points du profil dans `LatheGeometry` (bouteille, pot, flacon).

## 5. Mettre une vraie voix off

Les voix de navigateur sont robotisées. Pour une vraie voix :

1. Génère 1 fichier audio par section (ElevenLabs, par exemple) : `vo-0.mp3`, `vo-1.mp3`, ...
2. Dans `doSpeak(i)`, remplace la partie `speechSynthesis` par :
   ```js
   const a = new Audio('vo-' + i + '.mp3');
   a.onended = done;
   a.play();
   ```
3. Mets les mp3 à côté du `index.html` (ou héberge-les).

## 6. Publier

- **Test local** : ouvre `index.html` dans Chrome (connexion internet nécessaire pour les bibliothèques).
- **En ligne** : dépose le dossier sur Vercel, Netlify ou GitHub Pages.
- **Mobile** : le script gère déjà l'écran étroit (variable `L.mobile`).

## 7. Demander à Claude de refaire ce type de site

Modèle de demande :

> Crée un site 3D scrollytelling pour [marque / produit] avec three.js et GSAP ScrollTrigger, en un seul fichier HTML. Étapes : [liste des sections]. Le produit [décris-le ou donne le .glb]. Couleurs : [palette]. Ajoute des particules [pétales, bulles, étincelles], une voix off en français, des sous-titres et une visite guidée automatique. Fonctionne sur mobile.

Donne-lui aussi : les images ou le logo, les textes réels, et les chiffres exacts.
