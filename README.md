# Trust — Password Manager

> **Projet de l'équipe *ReachingUncStatus***
>
> Présenté au **Shacks 2025 — Hackathon de l'Université de Sherbrooke** (Thème : **Sécurité**)

---

## Description générale

**Trust** est un gestionnaire de mots de passe léger, sécurisé et pensé pour l'apprentissage et la démonstration en contexte hackathon. L'objectif principal est de fournir une solution simple pour stocker, chiffrer et gérer des identifiants, tout en mettant l'accent sur les bonnes pratiques de sécurité (chiffrement au repos, dérivation de clé, et flux minimal d'authentification).

Ce dépôt contient le code source, la documentation et des scripts pour exécuter Trust localement ou en démonstration.

---

## Principales fonctionnalités

* Stockage chiffré des mots de passe
* Interface extension WEB
* Politique minimale de mot de passe et vérification de force
* Récupération de compte avec des gardiens de confiance
* Remplissage automatique des champs sur un site web

---

## Architecture & composants

* **Backend** : bibliothèque responsable du chiffrement, stockage (SQLite chiffré)
* **Frontend** : Extension WEB

---

## Stack technique

* Langage principal : Type Script
* Chiffrement : bcrypt
* Stockage : SQLite (ORM)


> **Remarque sécurité** : ce projet est une démonstration. Ne l'utilisez pas pour stocker des informations sensibles en production sans audit indépendant.

---

## Installation back-end

> **Prérequis** : git, node pour npm

```bash
# cloner le dépôt
git clone https://github.com/HydroshieldMKII/shacks.git

# se déplacer dans le dossier backend
cd backend
npm i
```

---

## Contacts

**Équipe** : ReachingUncStatus

**Projet** : Trust — Password Manager

**Organisation** : Shacks 2025 — Hackathon de l'Université de Sherbrooke

---
