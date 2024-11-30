/**
 * @fileoverview Enables Authentication across all endpoints
 * Checks if authentication is enabled using the environment variable
 * If a particular route or controller is marked Public(), skips authentication
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { isAuthEnabled } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
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
        const payload = await this.authService.verifyToken(token);
        request['authInfo'] = payload;

        return true;
    }
}
