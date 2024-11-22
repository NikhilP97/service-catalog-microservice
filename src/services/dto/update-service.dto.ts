import { PartialType } from '@nestjs/mapped-types'; // TODO: Change to swagger library

import {
    ServiceRequestBody,
    ServiceRequestParams,
    ServiceResponseDto,
} from './shared';

export class UpdateServiceRequestParamsDto extends ServiceRequestParams {}

export class UpdateServiceRequestBodyDto extends PartialType(
    ServiceRequestBody,
) {}

export class UpdateServiceResponseDto extends ServiceResponseDto {}
