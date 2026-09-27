# Pub mobile — boutique Cohesif Energy

Vidéo verticale 9:16 (1080×1920, 29 s) pour Instagram, TikTok, Stories et Shorts.
Elle filme le vrai parcours d'achat du site, avec zooms et touchers de doigt :

| Temps | Scène |
|---|---|
| 0–2,4 s | Logo Cohesif Energy, « Votre borne de recharge, en 3 clics. » |
| 2,4–7,8 s | ① Boutique : défilement jusqu'à la borne 7 kW, zoom, toucher « Détails » |
| 7,8–15 s | ② Fiche produit : choix « Borne + pose IRVE » (1 190 € TTC), toucher « Acheter maintenant » |
| 15–23,6 s | ③ Page de commande Cohesif Commerce : récapitulatif, total, toucher « Payer », badge paiement sécurisé |
| 23,6–28,8 s | Borne 7 kW dès 499 € TTC, avantages, bouton « Commander ma borne » |

Les pages sont chargées depuis les fichiers des dépôts `cohesif-energy` et
`Cohesif-commerce` (aucun accès au site en ligne, aucun paiement déclenché).

## Générer la vidéo

```bash
pip install playwright imageio-ffmpeg
python3 render.py                       # -> cohesif-energy-boutique-9x16.mp4
python3 render.py apercu --stills=5,12,20   # vignettes de contrôle
```

- Minutage, légendes et touchers : en haut de `render.py` (`TL`, `TAPS`, `NAV`).
- Habillage (intro, légendes, badge, fin) : `pub.html`.
