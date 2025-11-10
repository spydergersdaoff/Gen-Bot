<h1 align="center">
 🧬Gen Bot⚙
</h1>

<p align="center">
    Un bot Discord de génération de comptes efficace avec gestion de stock et système de cooldown.
</p>

---
## <a id="menu"></a>🔱 » Menu

- [🔰・Fonctionnalités](#features)
- [🎉・Installation](#setup)
- [⚙・Configuration](#config)
- [💻・Commandes](#commands)
- [🔗・Support Discord](https://discord.new/ymeKZjGHSg9Z)
---

## <a id="features"></a>🔰 » Fonctionnalités

* **⚡ Génération Rapide :** Système de génération basé sur des boutons pour une utilisation immédiate.
* **💾 Gestion de Stock :** Utilise des fichiers `.txt` pour maintenir un stock précis des comptes disponibles pour chaque service.
* **⏱️ Cooldown :** Limite les générations par utilisateur avec un cooldown configurable (actuellement **25 minutes**).
* **🛠️ Commandes Administrateur :** Commandes slash pour gérer le stock (`/create`, `/add`, `/stock`) et déployer le panel (`/panel`).
* **🔔 Système de Log :** Met à jour un message de log en temps réel dans un salon dédié.
* **📺 Activité Streaming :** Affichage du statut "En stream" lié à votre Twitch.

---

## <a id="setup"></a> 📁 » Installation

1.  Installez [Node.js](https://nodejs.org/).
2.  Clonez ou téléchargez le dépôt.
3.  Ouvrez le terminal dans le dossier du bot et exécutez la commande pour installer les dépendances :
    ```bash
    npm install
    ```
4.  Remplissez le fichier de configuration [**`config.json`**](#config).
5.  Déployez les commandes slash :
    ```bash
    node deploy-commands.js
    ```
6.  Démarrez le bot :
    ```bash
    node index.js
    ```

---

## <a id="config"></a>⚙ » Configuration

Pour configurer le bot, ouvrez le fichier **`config.json`** et remplissez les champs suivants :

| Clé | Description | Exemple |
| :--- | :--- | :--- |
| **`token`** | Le token de votre bot. | `TON_TOKEN_DE_BOT_ICI` |
| **`clientId`** | L'ID de votre application bot. | `ID_CLIENT_DE_TON_BOT` |
| **`guildId`** | L'ID de votre serveur principal. | `ID_DU_SERVEUR_PRINCIPAL` |
| **`adminRoleId`** | L'ID du rôle qui aura accès aux commandes d'administration. | `ID_DU_ROLE_ADMIN` |
| **`genChannelId`** | L'ID du salon où le panel de génération sera affiché. | `ID_SALON_GEN` |
| **`logChannelId`** | L'ID du salon où les logs de génération seront affichés. | `ID_SALON_LOG` |
| **`genCooldown`** | Le temps d'attente entre les générations (en millisecondes). | `1500000` (25 minutes) |
| **`panelGifUrl`** | L'URL du GIF/Image utilisé pour le panel et les DMs de confirmation. | `URL_DU_GIF_POUR_LE_PANEL` |

---

## <a id="commands"></a>💻 » Commandes

### Commandes Utilisateurs

| Commande | Description |
| :--- | :--- |
| **Boutons** | Déclenchement de la génération d'un compte (doit être effectué dans le salon configuré). |

### Commandes Administrateurs (Nécessite le rôle `adminRoleId`)

| Commande | Description |
| :--- | :--- |
| **`/panel`** | Envoie le panel de génération interactif dans le salon `genChannelId`. |
| **`/create [service_name] [emoji]`** | Crée un nouveau service ou met à jour l'emoji d'un service existant. |
| **`/add [service_name] [account_data]`** | Ajoute un compte (ex: `email:pass`) au stock du service spécifié. |
| **`/stock`** | Affiche le stock actuel de tous les services. |

---
