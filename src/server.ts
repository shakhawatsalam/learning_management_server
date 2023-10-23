import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function bootstrap() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/learning_managemant');
    console.log('🚀🚀 Data base Connected Successfully');
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('failed to Connect', error);
  }
}

bootstrap();
