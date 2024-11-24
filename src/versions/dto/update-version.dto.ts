import { PartialType } from '@nestjs/swagger';

import {
    VersionRequestBody,
    VersionRequestParams,
    VersionResponseDto,
} from './shared';

export class UpdateVersionReqParamsDto extends VersionRequestParams {}

export class UpdateVersionReqBodyDto extends PartialType(VersionRequestBody) {}

export class UpdateVersionResponseDto extends VersionResponseDto {}
