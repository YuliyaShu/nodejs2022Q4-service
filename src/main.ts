import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('REST Service')
    .setDescription(
      'Home Library Service! Users can create, read, update, delete data about Artists, Tracks and Albums, add them to Favorites in their own Home Library.',
    )
    .setVersion('1.0')
    .addTag('Home Library Service')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();
