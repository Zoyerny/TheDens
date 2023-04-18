import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types';
import { Request } from "express"

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => req.cookies?.refreshToken, // Extraire le token depuis les cookies
            secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
        const refreshToken = req.cookies?.refreshToken;

        return {
            ...payload,
            refreshToken,
        };
    }
}