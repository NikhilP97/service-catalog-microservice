import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { isAuthEnabled } from 'src/utility/auth';

const UNAUTHENTICATED_MSG = 'User is not authenticated';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private configService: ConfigService,
    ) {}

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // If auth is disabled, allow request to pass through
        if (!isAuthEnabled()) {
            return true;
        }

        // If route is marked public, allow request to pass through
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        // Check authentication
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException(UNAUTHENTICATED_MSG);
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            request['authInfo'] = payload;
        } catch {
            throw new UnauthorizedException(UNAUTHENTICATED_MSG);
        }

        return true;
    }
}
