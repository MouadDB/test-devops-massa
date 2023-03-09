## Test DevOps Massa

⚠️ **Pré-requis**

- **Docker** pour building et pushing les images.
- **Minikube** avoir un cluster local kubernetes

Pour déployer les deux micro-services dans des pods différents avec des images docker, nous avons besoin d'un environnement de conteneurisation tel que Kubernetes. Voici les étapes pour réaliser cela :

1. Créer les images docker pour les micro-services `patient` et `register`et les pusher sur docker hub.
2. Créer un fichier de déploiement Kubernetes pour le micro-service register qui contient les spécifications du pod et de l'image Docker à utiliser et aussi le service register pour exposer le port `30007` au public.
3. Créer un fichier de déploiement Kubernetes pour le micro-service patient qui contient les spécifications du pod et de l'image Docker à utiliser et aussi le service patient qui permetre les pods de register a connecter aux pods patient via le port `8081`.
4. créer le fichier `config-map` qui sera utilisé dans `register.yaml` pour charger les listes de patients.
5. Démarrage du cluster kubernetes et déploiement des microservices `registre` et `patient` et config-map avec la commande `kuberctl apply -f fichier.yaml`
6. Obtenir l'adresse IP externe du service d'enregistrement via la commande `minikube service register-service--url`

### Creation images Docker `register` et `patient` 

#### Creation Image Register
```bash
cd regsiter
docker build -t register:1.0 .
```

#### Pushing Image Register
```bash
docker tag register:1.0 mouaddb/register:latest
docker push mouaddb/register:latest
```


#### Creation Image Patient
```bash
cd patient
docker build -t patient:1.0 .
```

#### Pushing Image Patient
```bash
docker tag patient:1.0 mouaddb/patient:latest
docker push mouaddb/patient:latest
```

### Les fichiers Kubernetes les micro-services

#### ``regsiter.yaml``

Le premier bloc de code décrit un objet de type "Deployment" nommé "register" avec trois répliques, qui utilise l'image Docker "mouaddb/register:latest" et expose le port 8080. Il définit également deux variables d'environnement "PATIENT_TYPE" et "PATIENT_LIST_FILE" et monte un volume "patient-types-volume" qui est configuré par la ConfigMap "patient-types".

Le deuxième bloc de code décrit un objet de type "Service" nommé "register-service" de type "NodePort" qui permet l'accès à l'application en utilisant le port 30007. Le service redirige le trafic vers les répliques du déploiement "register" en utilisant le label "app: register".


#### ``patient.yaml``

Le premier bloc de code décrit un objet de type "Deployment" nommé "patient" avec trois répliques, qui utilise l'image Docker "mouaddb/patient:latest" et expose le port 8081. Il définit également un label "app: patient" pour l'objet.

Le deuxième bloc de code décrit un objet de type "Service" nommé "patient-service" qui redirige le trafic vers les répliques du déploiement "patient" en utilisant le label "app: patient". Le service expose le port 8081 pour les connexions entrantes et redirige le trafic vers le port 8081 pour permettre les pods `register` re communiquer avec les pods`patient`.

#### ``config.yaml``
Ce fichier décrit une ressource Kubernetes de type "ConfigMap" nommée "patient-types". Cette ressource contient deux fichiers JSON nommés "patient-list-1.json" et "patient-list-2.json".

Pour permettre au register d'accéder à différents types de patients avec des listes de patients différents, j'ai utilisé des variables d'environnement et le fichier de config-map pour pour spécifier la liste de patients à utiliser pour chaque déploiement de pod et. Modifiez le fichier les variables `PATIENT_TYPE` et `PATIENT_LIST_FILE` dans le ficher `regsiter.yaml` pour spécifier la liste de patients à utiliser.

### Déploiement

En commençant par charger le fichier de mappage de configuration, le fichier de register et apres le fichier patient

```bash
kubectl apply -f config-map.yaml
kubectl apply -f register.yaml
kubectl apply -f patient.yaml
```

### Testing

Pour obtenir l'URL du service d'enregistrement à vérifier:

```bash
minikube service register-service--url
```
vous pouvez accéder ```http://192.168.59.101:30007/patients```

### Patient Lists

Pour voir la liste des patients du micro-service patient, vous pouvez affecter la variable "PATIENT_TYPE" dans le fichier "register.yaml" au "BASIC" ou autre chose que "OTHER".

### Détruire tous les déploiements

```bash
kubectl delete service register-service
kubectl delete service patient-service
kubectl delete deployment patient
kubectl delete deployment register
```

### Les difficultés rencontrées

La difficulté que j'avais rencontrée était de faire communiquer deux micro services entre eux sans changer le code dans `register/index.js`, j'ai donc fini par changer la variable `PATIENT_ADDRESS` par le nom de micro-service de `patient`:
```javascript
const PATIENT_ADDRESS = "http://patient-service:8081"
```

et pour importer la liste des dossiers des patients à partir du conteneur et accéder aux variables d'environnement, j'ai ajouté ce code
```javascript

// Import patient list
if (process.env.PATIENT_TYPE == "OTHER")
{
  patients = require('/etc/config/'+process.env.PATIENT_LIST_FILE)
}
```
et aussi en ajoutant une condition dans la route `/patient/:id`
```javascript

if (process.env.PATIENT_TYPE == "OTHER") {
  res.send(patients.find((patient) => patient.patientId == req.params.id))
}
```

### Résumé
Le test était assez simple, facile et intéressant à la fois, car il gère l'aspect de la communication entre les microservices, et ce sujet m'intéresse beaucoup car je travaille sur un projet avec les mêmes concepts, donc c'est très instructif
