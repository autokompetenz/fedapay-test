// Test 3 : serveur webhook local — FedaPay POST ici à chaque événement
import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      console.log('📩 Webhook reçu :', new Date().toISOString());
      console.log(body);
      res.writeHead(200).end('ok');
    });
  } else {
    res.writeHead(200).end('Webhook server up. POST /webhook pour recevoir.');
  }
});

server.listen(3000, () => console.log('🚀 Webhook en écoute sur http://localhost:3000/webhook'));
