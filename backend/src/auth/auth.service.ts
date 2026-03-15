import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = randomBytes(64).toString('hex');

    await this.cacheManager.set(`refresh:${refreshToken}`, user.id, 7 * 24 * 60 * 60 * 1000);

    return plainToInstance(LoginResponseDto, {
      user: { id: user.id, name: user.name, email: user.email },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async refreshToken(refreshToken: string) {
    const userId = await this.cacheManager.get<string>(`refresh:${refreshToken}`);
    if (!userId) throw new UnauthorizedException('Invalid or expired refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return plainToInstance(LoginResponseDto, {
      user: { id: user.id, name: user.name, email: user.email },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async logout(accessToken?: string, tokenExp?: number, refreshToken?: string) {
    if (refreshToken) {
      await this.cacheManager.del(`refresh:${refreshToken}`);
    }
    if (accessToken && tokenExp) {
      const expiresIn = tokenExp - Math.floor(Date.now() / 1000);
      if (expiresIn > 0) {
        await this.cacheManager.set(`revoke:${accessToken}`, true, expiresIn * 1000);
      }
    }

    return null;
  }
}
