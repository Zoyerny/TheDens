import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignUpInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignReponse } from './dto/sign-reponse';
import { SignInInput } from './dto/signin-input';
import { LogoutReponse } from './dto/logout-response';
import { Public } from './decorators/public.decorator';
import { NewTokenReponse } from './dto/newTokensReponse';
import { CurrentUserId } from './decorators/currentUserId.decorator';
import { CurrentUser } from './decorators/currentUser.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  // Mutation pour inscrire un nouvel utilisateur
  @Public()
  @Mutation(() => SignReponse)
  signup(@Args('signUpInput') signUpInput: SignUpInput) {
    // Appelle le service AuthService pour inscrire un nouvel utilisateur
    return this.authService.signup(signUpInput);
  }

  // Mutation pour connecter un utilisateur existant
  @Public()
  @Mutation(() => SignReponse)
  signin(@Args('signInInput') signInInput: SignInInput) {
    // Appelle le service AuthService pour connecter un utilisateur existant
    return this.authService.signin(signInInput);
  }

  // Query pour récupérer un utilisateur par son ID
  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => String }) id: string) {
    // Appelle le service AuthService pour récupérer un utilisateur par son ID
    return this.authService.findOne(id);
  }

  // Mutation pour mettre à jour les informations d'un utilisateur
  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    // Appelle le service AuthService pour mettre à jour les informations d'un utilisateur
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  // Mutation pour déconnecter un utilisateur
  @Public()
  @Mutation(() => LogoutReponse)
  logout(@Args('id', { type: () => String }) id: string) {
    // Call the AuthService to logout a user
    return this.authService.logout(id);
  }

  // Query pour tester la connexion au serveur
  @Query(() => String)
  hello() {
    return 'Hello world !';
  }

  // Mutation pour générer de nouveaux jetons d'accès et d'actualisation
  // pour un utilisateur ayant un jeton d'actualisation valide
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokenReponse)
  getNewTokens(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
    @Args('refreshToken', { type: () => String }) refreshTokenArg: string,
  ) {
    // Appelle le service AuthService pour générer de nouveaux jetons
    return this.authService.getNewTokens(userId, refreshToken);
  }
  

}