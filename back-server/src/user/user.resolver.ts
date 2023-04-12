import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async onlineUsers() {
    return this.userService.getOnlineUsers();
  }

  @Query(() => [User])
  async offlineUsers() {
    return this.userService.getOfflineUsers();
  }
}
