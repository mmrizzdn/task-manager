import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, BadRequestException, ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const details = errors.map((err: ValidationError) => {
          const fieldName = err.property === 'isCompleted' ? 'is_completed' : err.property;
          const message = Object.values(err.constraints || {}).join(', ');
          return {
            field: fieldName,
            message,
          };
        });
        throw new BadRequestException(details);
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.get<number>('port')!;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
void bootstrap();
