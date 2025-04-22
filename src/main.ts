import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('API Physical Store')
  .setDescription('Documentação da API da Physical Store - ViaCEP, Mapbox, ORS, Melhor Envio')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(2099);
  console.log(`Rodando em http://localhost:${2099}`);
}
bootstrap();
