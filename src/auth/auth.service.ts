/**
 * @fileoverview Core business logic for the auth entity
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { validateOrReject } from 'class-validator';

import { TokenRequestBodyDto } from './dto/auth.dto';

const UNAUTHENTICATED_MSG = 'User is not authenticated';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async generateToken(tokenRequestDto: TokenRequestBodyDto): Promise<string> {
        validateOrReject(tokenRequestDto);

        const payload = {
            sub: tokenRequestDto.user_id,
            roles: tokenRequestDto.roles,
        };

        return await this.jwtService.signAsync(payload);
    }

    async verifyToken(token: string | undefined): Promise<any> {
        if (!token) {
            throw new UnauthorizedException(UNAUTHENTICATED_MSG);
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            return payload;
        } catch {
            throw new UnauthorizedException(UNAUTHENTICATED_MSG);
        }
    }
}
