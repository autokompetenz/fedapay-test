// Crée une transaction FedaPay et renvoie l'URL de checkout
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST uniquement' });

  const { amount, firstname, lastname, email, phone } = req.body || {};
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Montant invalide' });
  }

  const KEY = process.env.FEDAPAY_SECRET_KEY;
  const BASE = process.env.FEDAPAY_BASE_URL ?? 'https://sandbox-api.fedapay.com/v1';
  const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

  try {
    const txRes = await fetch(`${BASE}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        description: `Paiement de ${amount} XOF`,
        amount: Number(amount),
        currency: { iso: 'XOF' },
        callback_url: 'https://fedapay-test.vercel.app/api/webhook',
        customer: {
          firstname: firstname || 'Client',
          lastname: lastname || 'Test',
          email: email || 'client@example.com',
          phone_number: { number: phone || '97000000', country: 'bj' },
        },
      }),
    });
    const tx = await txRes.json();
    const id = tx?.v1?.id;
    if (!id) return res.status(500).json({ error: 'Création transaction échouée', details: tx });

    const tokenRes = await fetch(`${BASE}/transactions/${id}/token`, { method: 'POST', headers });
    const token = await tokenRes.json();

    res.status(200).json({ url: token.url, transactionId: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
