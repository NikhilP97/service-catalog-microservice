import { ServiceRequestParams } from 'src/services/dto/shared';
import { VersionRequestBody, VersionResponseDto } from './shared';

export class CreateVersionReqParamsDto extends ServiceRequestParams {}

export class CreateVersionReqBodyDto extends VersionRequestBody {}

export class CreateVersionResponseDto extends VersionResponseDto {}
