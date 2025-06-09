require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const puppeteer = require('puppeteer');

const VALID_API_KEY = process.env.API_KEY; // 本番なら.envに書く

// 認証用フック
fastify.addHook('onRequest', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== VALID_API_KEY) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

fastify.get('/api/scrape', async (request, reply) => {
  const url = request.query.url;
  if (!url) {
    return reply.status(400).send({ error: 'url query parameter is required' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const content = await page.content();
    await browser.close();

    reply.type('text/html').send(content);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log('Server running');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
