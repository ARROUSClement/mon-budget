# Mon Budget — v1

Web app (PWA) pour iPhone, **100 % locale** : tes données restent dans ton téléphone, aucun serveur, aucun compte.

## Fonctionnalités

- **Saisie manuelle** (dépense / revenu, date libre → idéal pour rattraper les dépenses passées du mois ; bouton « Enregistrer + une autre »).
- **Récurrents** : loyer, EDF, abonnements, salaire… avec périodicité (semaine, 2 semaines, mois, 2 mois, trimestre, semestre, année ou personnalisée), date de fin, pause. Les opérations sont créées automatiquement à chaque échéance ; les prélèvements à venir sont affichés et comptés dans les budgets.
- **Budgets mensuels par catégorie**, avec **suggestion automatique** à partir de la moyenne de tes dépenses des 3 derniers mois, et estimation de l'épargne possible (revenus moyens − budgets).
- **Import du relevé bancaire** CSV ou OFX (format La Banque Postale reconnu automatiquement, encodage Windows-1252 géré) → récupère ton **historique**. Doublons ignorés si tu réimportes.
- **Apple Pay** via un Raccourci iOS (automatisation « Transaction ») ; les paiements captés sont **rapprochés** du relevé bancaire importé ensuite (pas de doublon).
- Catégorisation automatique par commerçant + apprentissage quand tu corriges une catégorie.
- Sauvegarde / restauration JSON, export CSV, mode sombre, fonctionne hors ligne.

## Mettre l'app sur ton iPhone

Il faut que les fichiers soient servis en **HTTPS**. Le plus simple (gratuit, 2 min) :

1. Va sur <https://app.netlify.com/drop> (compte gratuit), glisse-dépose le dossier `app_finance`.
   *Alternative : un dépôt GitHub + GitHub Pages.*
2. Ouvre l'URL obtenue dans **Safari** sur l'iPhone → bouton Partager → **Sur l'écran d'accueil**.
3. Lance l'app depuis l'icône « Budget ».

> Le site ne contient que le code : tes données ne sont jamais envoyées dessus.

Test rapide sur PC : `python3 -m http.server 8000` dans ce dossier puis <http://localhost:8000>.

## Récupérer l'historique (La Banque Postale)

labanquepostale.fr → ton compte → télécharger les opérations au format **CSV** (période la plus longue possible) → dans l'app : **Réglages → Importer un fichier**.

## Apple Pay automatique

Voir **Réglages → Apple Pay → Voir la configuration** dans l'app. Résumé : Raccourcis → Automatisation → Transaction → « Ajouter au fichier texte » `Raccourcis/budget-applepay.txt` avec la ligne
`AP|[Date au format yyyy-MM-dd HH:mm]|[Montant]|[Commerçant]|[Carte]`, puis import du fichier dans l'app.

## Important

- iOS peut effacer les données d'un site **non ajouté à l'écran d'accueil** après 7 jours sans visite : installe l'app sur l'écran d'accueil et **exporte une sauvegarde** régulièrement.
- Mise à jour du code : modifie les fichiers, incrémente `VERSION` dans `sw.js`, redéploie.

## v2 (plus tard)

Synchronisation bancaire automatique (DSP2 via un agrégateur type Enable Banking / Powens / Bridge) — nécessite un petit serveur.
