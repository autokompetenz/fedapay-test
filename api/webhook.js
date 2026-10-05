// Endpoint webhook pour Vercel (serverless function)
export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('📩 Webhook reçu :', JSON.stringify(req.body));
    return res.status(200).json({ ok: true });
  }
  res.status(200).send('Webhook endpoint up. POST ici pour recevoir.');
}
