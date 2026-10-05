# FedaPay Test (Node.js)

Petit projet de test pour l'API FedaPay :

- `npm run pay` → crée une transaction et génère le lien de checkout
- `npm run webhook` → serveur webhook local (port 3000)
- `api/webhook.js` → endpoint webhook serverless pour Vercel

## Setup

1. `cp .env.example .env` et renseigne ta clé `sk_sandbox_...`
2. `npm run pay`

## Déploiement

Déployé sur Vercel. L'URL du webhook en production sera :
`https://<ton-projet>.vercel.app/api/webhook`
