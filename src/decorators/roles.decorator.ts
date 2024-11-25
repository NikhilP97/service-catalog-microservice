import { Reflector } from '@nestjs/core';

import { DefinedRoles } from 'src/types/auth.enum';

export const Roles = Reflector.createDecorator<DefinedRoles[]>();
