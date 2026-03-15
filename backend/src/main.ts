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

  const corsOrigin = configService.getOrThrow<string>('corsOrigin');
  app.enableCors({
    origin: corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
  app.useGlobalFilters({
    catch(exception, host) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      console.error('GLOBAL ERROR:', JSON.stringify(exception));
      response.status(500).json({ error: exception.message || exception });
    }
  } as any);

  const port = configService.get<number>('port')!;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
void bootstrap();
