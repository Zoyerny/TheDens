import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt'
import { JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(public config: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => req.cookies?.accessToken, // Extraire le token depuis les cookies
            secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}