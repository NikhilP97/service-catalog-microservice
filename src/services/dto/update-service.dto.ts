import { PartialType } from '@nestjs/swagger';

import {
    ServiceRequestBody,
    ServiceRequestParams,
    ServiceResponseDto,
} from './shared';

export class UpdateServiceReqParamsDto extends ServiceRequestParams {}

export class UpdateServiceReqBodyDto extends PartialType(ServiceRequestBody) {}

export class UpdateServiceResponseDto extends ServiceResponseDto {}
