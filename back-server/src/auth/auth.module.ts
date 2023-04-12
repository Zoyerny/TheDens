import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccesTokenStrategy } from './strategies/acessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [AuthResolver,
    AuthService,
    JwtService,
    PrismaService,
    AccesTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule { }
