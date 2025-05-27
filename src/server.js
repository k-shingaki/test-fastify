// server.js
const fastify = require('fastify')({ 
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  } 
});

// cors
fastify.register(require('@fastify/cors'), {
  origin: true
});

// get endpoint
fastify.get('/api/sample', async(req, res) => {
  return { message: 'success'}
});

// start server
const start = async() => {
  try {
    await fastify.listen({ port: 8000 });
    console.log('Server Running at http://localhost:8000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();