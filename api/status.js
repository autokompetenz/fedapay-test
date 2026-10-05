// Vérifie le statut d'une transaction et renvoie un message clair
export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id requis' });

  const KEY = process.env.FEDAPAY_SECRET_KEY;
  const BASE = process.env.FEDAPAY_BASE_URL ?? 'https://api.fedapay.com/v1';

  const r = await fetch(`${BASE}/transactions/${id}`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  const json = await r.json();
  const t = json['v1/transaction'] ?? json.v1 ?? json;

  const messages = {
    INSUFFICIENT_FUND_ERROR: '❌ Solde insuffisant sur ce compte Mobile Money. Recharge puis réessaie.',
    ACCOUNT_NOT_FOUND: '❌ Numéro introuvable pour ce mode de paiement. Vérifie le numéro et que tu as choisi le bon opérateur (MTN/Moov).',
    TRANSACTION_FAILED: '❌ Le paiement a échoué. Réessaie.',
    TIMEOUT: '⏱️ Délai dépassé : aucune confirmation reçue. Réessaie.',
  };

  res.status(200).json({
    status: t.status,
    message:
      t.status === 'approved'
        ? '✅ Paiement confirmé ! Merci pour ta contribution.'
        : t.status === 'pending'
          ? '⏳ En attente : confirme le paiement sur ton téléphone avec ton code PIN.'
          : messages[t.last_error_code] ?? `❌ Paiement non abouti (${t.last_error_code ?? 'erreur inconnue'}). Réessaie.`,
  });
}
