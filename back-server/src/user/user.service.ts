import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getOnlineUsers() {
    return this.prisma.user.findMany({
      where: { onlineUser: { NOT: null } },
    });
  }

  async getOfflineUsers() {
    return this.prisma.user.findMany({
      where: { onlineUser: null },
    });
  }
}
