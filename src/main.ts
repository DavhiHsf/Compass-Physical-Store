import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(2099);
  console.log(`Rodando em http://localhost:${2099}`);
}
bootstrap();
