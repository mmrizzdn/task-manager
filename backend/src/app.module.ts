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
        const redisStore = createKeyv(configService.get<string>('redis.url'));

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
export class AppModule { }
