import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import * as argon from 'argon2';
import { SignInInput } from './dto/signin-input';
import { User } from '../user/user.entity';
import { ID } from '@nestjs/graphql';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  // Méthode pour inscrire un nouvel utilisateur
  async signup(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        username: signUpInput.username,
        hashedPassword,
        email: signUpInput.email,
      },
    });

    const { accessToken, refreshToken } = await this.createTokens(
      user.id.toString(),
      user.email,
    );

    await this.updateRefreshToken(user.id.toString(), refreshToken);
    await this.setOnlineStatus(user.id, true);
    await this.logout(user.id)

    return { accessToken, refreshToken, user };
  }

  async signin(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInInput.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User doesent exixt');
    }

    const doPasswordMatch = await argon.verify(
      user.hashedPassword,
      signInInput.password,
    );

    if (!doPasswordMatch) {
      throw new ForbiddenException('Password do not match');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id.toString(),
      user.email,
    );

    await this.updateRefreshToken(user.id.toString(), refreshToken);
    await this.setOnlineStatus(user.id, true);
    return { accessToken, refreshToken, user };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  async createTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  // Méthode pour déconnecter un utilisateur
  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });

    try{
      const existingOnlineUser = await this.prisma.onlineUser.findUnique({
        where: { userId },
      });

      if (existingOnlineUser) {
        await this.prisma.onlineUser.delete({
          where: {
            userId: userId,
          },
        });
      }
    }catch(error){

    }

    return { loggedOut: true };
  }

  async getUserIdBySocketId(socketId: string): Promise<string> {
    const onlineUser = await this.prisma.onlineUser.findUnique({
      where: {
        socketId: socketId,
      },
      select: {
        userId: true,
      },
    });

    return onlineUser?.userId;
  }

  async getNewTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const refreshTokenPayload = await this.jwtService.verifyAsync<{
      userId: string;
    }>(rt, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    if (refreshTokenPayload.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenMatching = await argon.verify(   
      user.hashedRefreshToken,
      rt,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id.toString(),
      user.email,
    );

    await this.updateRefreshToken(user.id.toString(), refreshToken);
    return { accessToken, refreshToken };
    
  }

  async setOnlineStatus(userId: string, isOnline: boolean) {
    if (isOnline) {
      // Vérifier si l'utilisateur en ligne existe déjà
      const existingOnlineUser = await this.prisma.onlineUser.findUnique({
        where: { userId },
      });

      // Si l'utilisateur en ligne n'existe pas, créez une nouvelle entrée
      if (!existingOnlineUser) {
        await this.prisma.onlineUser.create({
          data: { userId, },
        });
      }
    } else {
      // Si l'utilisateur n'est pas en ligne, supprimez l'entrée correspondante
      await this.prisma.onlineUser.delete({
        where: { userId },
      });
    }
  }

  async setSocket(userId: string, socketId: string) {
    const existingOnlineUser = await this.prisma.onlineUser.findUnique({
      where: { userId },
    });
    if (existingOnlineUser) {
      await this.prisma.onlineUser.update({
        where: {
          userId: userId,
        },
        data: {
          socketId: socketId,
        },
      });
    }
  }



  async getUsers() {

    const onlineUsersGet = await this.prisma.user.findMany({
      where: {
        onlineUser: {
          isNot: null,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        onlineUser: {
          select: {
            createdAt: true,
            socketId: true,
          },
        },
      },
    });

    const offlineUsersGet = await this.prisma.user.findMany({
      where: {
        onlineUser: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        onlineUser: true
      }
    });

    const onlineUsers = onlineUsersGet.map((user) => ({
      id: user.id,
      socketId: user.onlineUser.socketId,
      username: user.username,
      email: user.email,
      connectedAt: user.onlineUser.createdAt,
    }));

    const offlineUsers = offlineUsersGet.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));

    return { onlineUsers: onlineUsers, offlineUsers: offlineUsers };
  }

}
