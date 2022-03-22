import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { constant } from './common/constants/constant';
import { LoggerInterceptor } from './common/interceptor/logger.interceptor';

/**
* @description bootstrap method starts your application with first module as AppModule.
*/
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix(constant.PREFIX.api_prefix)
  app.useGlobalInterceptors(new LoggerInterceptor())
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
