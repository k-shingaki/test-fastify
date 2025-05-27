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
    const PORT = process.env.PORT || 8000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server Running at http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();