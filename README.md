Bienvenue dans le test technique pour le poste de stagiaire DevOps à Massa.

## Enoncé

Il y a deux micro-services `patient` et `register`. Le but est de pouvoir déployer ces deux micro-services dans des pods différents avec des images docker.

Après avoir créer les pods avec les deux micro-services il faut que les pods `register` soit capable de communiquer avec les pods `patient`.

En bonus, vous pouvez faire en sorte que le `register` est accès à X types de `patient` qui auraient des listes de patients différents (cela peut etre la même liste avec un champ qui diffère comme la date de consultation en plus). Les listes de patients seraient passées au moment de la création des pods (ou autre système Kubernetes utilisés dans ce cas) et donc pourraient changer d'un déploiement à l'autre.

Tout autre bonus est appréciable.

## Rendu

Le dossier devra être rendu en ZIP et contenir un fichier à la racine qui explique comment utiliser le projet (l'usage doit supporter Linux, Mac et Windows).

Un fichier expliquant votre reflexion au cours du tests, les difficultés rencontrées est un plus.

Pour la moindre question n'hésitez pas à me contacter à af@massa.net