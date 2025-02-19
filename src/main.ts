import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port ?? 3000);
}

bootstrap();
