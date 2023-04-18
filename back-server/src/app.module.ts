import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { HandlerSocketGateway } from './socket/handler-socket/handler-socket.gateway';
import { SendSocketGateway } from './socket/send-socket/send-socket.gateway';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    // Importation du module GraphQL
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      // Utilisation de la configuration du service Config pour déterminer les options du module GraphQL
      useFactory: (config: ConfigService) => {
        return {
          // Configuration des options CORS pour permettre les requêtes provenant du client
          cors: {
            origin: config.get('CLIENT_URL'),
          },
          // Définition du fichier de schéma GraphQL
          autoSchemaFile: join(
            process.cwd(),
            config.get<string>('SCHEMA_PATH'),
          ),
          // Tri des types dans le schéma pour faciliter la lecture
          sortSchema: true,
          // Activation de l'interface Playground pour faciliter les tests et le débogage
          playground: true,
        };
      },
      // Injection du service Config pour accéder aux options de configuration
      inject: [ConfigService],
    }),
    // Importation du module Config pour la gestion des options de configuration
    ConfigModule.forRoot({ isGlobal: true }),
    // Importation du module Auth pour la gestion de l'authentification
    AuthModule,
    // Importation du module User pour la gestion des utilisateurs
    UserModule,
  ],
  controllers: [],
  // Fournisseurs de services et d'injection de dépendances
  providers: [
    PrismaService, // Service Prisma pour interagir avec la base de données
    // Utilisation du garde AccesTokenGuard pour protéger les routes nécessitant une authentification
    { provide: APP_GUARD, useClass: AccessTokenGuard }, HandlerSocketGateway, SendSocketGateway, AuthService, JwtService,
  ],
})
export class AppModule { }
