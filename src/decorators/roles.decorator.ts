/**
 * @fileoverview Routes or controllers marked with this decorator will be enforced with role based authentication
 * The core logic for this is enforced in roles.guard.ts
 */
import { Reflector } from '@nestjs/core';

import { DefinedRoles } from 'src/constants';

export const Roles = Reflector.createDecorator<DefinedRoles[]>();
