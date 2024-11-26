/**
 * @fileoverview Data transfer objects (DTO) for the auth entity
 * Contains internal DTOs as well as Swagger DTOs
 */
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsEnum, IsArray } from 'class-validator';

import { DefinedRoles } from 'src/constants';
import { EntityResponse } from 'src/types/common.dto';

export class TokenRequestBodyDto {
    @ApiProperty({
        description: 'The unique ID of the user',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @ApiProperty({
        description: 'The roles to be encoded in the JWT token',
        enum: DefinedRoles,
        isArray: true,
        example: [DefinedRoles.Admin, DefinedRoles.User],
    })
    @IsNotEmpty()
    @IsArray()
    @IsEnum(DefinedRoles, { each: true })
    roles: DefinedRoles[];
}

export class TokenResponseDto {
    @ApiProperty({
        description: 'The JWT token containing the user id and roles',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMTNkZjI1Mi1jMTEwLTQ5ZGMtYmVjMC05YjkwOTU5MmUzNWYiLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MzI1MDQ4NzIsImV4cCI6MTczMjUxNTY3Mn0.rKnu83lfn-4bPlNDTj7H1FDbtRbfMcsdkNWLhM8-Q_4',
    })
    @Expose()
    access_token: string;
}

export class AuthInformation {
    @ApiProperty({
        description: 'message indicating what the endpoint does',
        example:
            'This is an admin endpoint and requires the user to have an admin role',
    })
    @Expose()
    message: string;
}

export class AuthInformationDto extends EntityResponse<AuthInformation> {
    constructor() {
        super(AuthInformation);
    }

    @ApiProperty({
        description: 'The information about the token entity',
        type: AuthInformation,
    })
    entity: AuthInformation;
}
