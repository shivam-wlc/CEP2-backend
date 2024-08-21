import chalk from 'chalk';
import mongoose from 'mongoose';
import config from '##/src/config/config.js';

// Initialize Mongoose
async function connect() {
  // https://mongoosejs.com/docs/guide.html#strictQuery
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(config.db, {});

    return mongoose.connection;
  } catch (error) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.error(error);
  }
}

async function disconnect() {
  await mongoose.connection.close();
}

export { connect, disconnect };
