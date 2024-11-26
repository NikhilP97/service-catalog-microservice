/**
 * @fileoverview Routes or controllers marked with this decorator will skip authentication
 * The core logic for this is enforced in auth.guard.ts
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
