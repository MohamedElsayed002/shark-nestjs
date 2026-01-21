let cachedHandler;

module.exports = async (req, res) => {
  try {
    if (!cachedHandler) {
      // Dynamic import for ES modules
      const { bootstrap } = await import('../dist/main.js');
      const app = await bootstrap();
      const expressApp = app.getHttpAdapter().getInstance();
      cachedHandler = expressApp;
    }
    return cachedHandler(req, res);
  } catch (error) {
    console.error('Error initializing NestJS app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

