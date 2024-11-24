import { ServiceRequestParams } from 'src/services/dto/shared';
import { VersionResponseListDto } from './shared';

export class ListVersionsReqParamsDto extends ServiceRequestParams {}

export class ListVersionsResponseDto extends VersionResponseListDto {}
