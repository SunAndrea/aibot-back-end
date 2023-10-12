const { default: mongoose } = require('mongoose');
const app = require('./app');
const logger = require('./logger');

const { DB_URI, PORT } = process.env;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    app.listen(PORT || 3000, () =>
      logger.info(`Database connection successful in port ${PORT}`)
    );
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

startServer();
