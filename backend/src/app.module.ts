import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('redis.host');
        const port = configService.get<number>('redis.port');

        const redisStore = createKeyv(`redis://${host}:${port}`);

        redisStore.on('error', (err) => {
          console.error('Redis connection error:', err.message);
        });

        return {
          stores: [redisStore],
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
