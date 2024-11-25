import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsEnum, IsArray } from 'class-validator';

import { DefinedRoles } from 'src/types/auth.enum';
import { EntityResponse } from 'src/types/common.dto';

export class GenerateJwtDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @IsNotEmpty()
    @IsArray()
    @IsEnum(DefinedRoles, { each: true })
    roles: DefinedRoles[];
}

export class GenerateJwtResponse {
    @Expose()
    access_token: string;
}

export class AuthInformation {
    @Expose()
    message: string;
}

export class AuthInformationDto extends EntityResponse<AuthInformation> {
    constructor() {
        super(AuthInformation);
    }
}
