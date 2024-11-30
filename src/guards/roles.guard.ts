/**
 * @fileoverview Enables authorization across endpoints using Role based access control
 * If a route or controller is marked with Roles([]) decorator, the JWT token must contain those roles
 * The required roles must be a subset of the user provided roles to access the route
 */
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { DefinedRoles } from 'src/constants';
import { isAuthEnabled, isEmptyValue } from 'src/utils';
import { Roles } from 'src/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    /**
     * Checks if the requiredRoles are a subset of userRoles.
     * @param requiredRoles - Roles required to access a resource.
     * @param userRoles - Roles assigned to the user.
     * @returns `true` if all requiredRoles are present in userRoles; otherwise `false`.
     */
    validateRoles(
        requiredRoles: DefinedRoles[],
        userRoles: DefinedRoles[],
    ): boolean {
        return requiredRoles.every((role) => userRoles.includes(role));
    }

    canActivate(context: ExecutionContext): boolean {
        // If auth is disabled, allow request to pass through
        if (!isAuthEnabled()) {
            return true;
        }

        const requiredRoles = this.reflector.get(Roles, context.getHandler());

        /**
         * If roles not specified, allow request to go through
         * In production systems, its recommend to reject requests and explicitly state which resource can be accessed by what roles
         */
        if (!requiredRoles) {
            return true;
        }

        const { authInfo } = context.switchToHttp().getRequest();
        // If auth info is missing, reject
        if (isEmptyValue(authInfo)) return false;

        const userRoles = authInfo.roles as DefinedRoles[];
        const isAuthorized = this.validateRoles(requiredRoles, userRoles);

        if (!isAuthorized) {
            throw new ForbiddenException(
                'Insufficient roles to access the resource',
            );
        }

        return isAuthorized;
    }
}
