// Test 1 & 2 : créer une transaction + générer le lien de paiement (checkout)
import { readFileSync } from 'node:fs';

// charge .env manuellement (pas de dépendance dotenv)
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  }
} catch {}

const KEY = process.env.FEDAPAY_SECRET_KEY;
const BASE = process.env.FEDAPAY_BASE_URL ?? 'https://sandbox-api.fedapay.com/v1';

if (!KEY || KEY.includes('xxxx')) {
  console.error('❌ Mets ta clé secrète sandbox dans .env (copie .env.example)');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

// 1) Créer la transaction
const txRes = await fetch(`${BASE}/transactions`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    description: 'Test paiement FedaPay',
    amount: 1000,
    currency: { iso: 'XOF' },
    callback_url: 'https://example.com/callback',
    customer: {
      firstname: 'Jean',
      lastname: 'Test',
      email: 'jean.test@example.com',
      phone_number: { number: '97000000', country: 'bj' },
    },
  }),
});
const tx = await txRes.json();
if (!tx.v1 || !tx.v1.id) {
  console.error('❌ Échec création transaction:', tx);
  process.exit(1);
}
const id = tx.v1.id;
console.log('✅ Transaction créée, id =', id, '| statut:', tx.v1.status);

// 2) Générer le token → URL de checkout
const tokenRes = await fetch(`${BASE}/transactions/${id}/token`, { method: 'POST', headers });
const token = await tokenRes.json();
console.log('✅ Lien de paiement (checkout) :');
console.log(token.url ?? token);
