/**
 * @fileoverview HTTP handles for the auth entity
 */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { APIErrorResponse } from 'src/types/common.dto';
import { DefinedRoles } from 'src/constants';
import { Roles, Public } from 'src/decorators';
import {
    APIInternalServerErrorResponse,
    APIUnauthenticatedExceptionResponse,
    APIForbiddenExceptionResponse,
} from 'src/types/swagger.dto';
import { AuthService } from './auth.service';
import {
    AuthInformationDto,
    TokenRequestBodyDto,
    TokenResponseDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'Generates a JWT token given a user id and an array of roles',
    })
    @ApiBadRequestResponse({
        type: APIErrorResponse,
    })
    @ApiInternalServerErrorResponse({
        type: APIInternalServerErrorResponse,
    })
    // Function definition
    @Public()
    @Post('generate-token')
    async generateToken(
        @Body() tokenRequestDto: TokenRequestBodyDto,
    ): Promise<TokenResponseDto> {
        const jwtString = await this.authService.generateToken(tokenRequestDto);

        const response: TokenResponseDto = {
            access_token: jwtString,
        };

        return plainToInstance(TokenResponseDto, response);
    }

    @ApiOperation({
        summary: 'Endpoint that can be accessed even when auth is turned on',
        description:
            'Demonstrates that this endpoint can be accessed even when authentication and authorization is enabled',
    })
    @ApiUnauthorizedResponse({
        type: APIUnauthenticatedExceptionResponse,
    })
    @ApiInternalServerErrorResponse({
        type: APIInternalServerErrorResponse,
    })
    // Function definition
    @Public()
    @Get('public-endpoint')
    publicEndpoint(): AuthInformationDto {
        const response: AuthInformationDto = {
            entity: {
                message:
                    'This is a public endpoint and does not have authentication or authorization',
            },
        };

        return plainToInstance(AuthInformationDto, response);
    }

    @ApiOperation({
        summary: 'Endpoint that can be accessed only with admin role',
        description:
            'If actor has other roles as well, access is still granted since user roles are a superset of the required roles',
    })
    @ApiUnauthorizedResponse({
        type: APIUnauthenticatedExceptionResponse,
    })
    @ApiForbiddenResponse({
        type: APIForbiddenExceptionResponse,
    })
    @ApiInternalServerErrorResponse({
        type: APIInternalServerErrorResponse,
    })
    // Function definition
    @Roles([DefinedRoles.Admin])
    @Get('admin-endpoint')
    adminEndpoint(): AuthInformationDto {
        const response: AuthInformationDto = {
            entity: {
                message:
                    'This is an admin endpoint and requires the user to have an admin role',
            },
        };

        return plainToInstance(AuthInformationDto, response);
    }

    @ApiOperation({
        summary: 'Endpoint that can be accessed only with user role',
        description:
            'If actor has other roles as well, access is still granted since user roles are a superset of the required roles',
    })
    @ApiUnauthorizedResponse({
        type: APIUnauthenticatedExceptionResponse,
    })
    @ApiForbiddenResponse({
        type: APIForbiddenExceptionResponse,
    })
    @ApiInternalServerErrorResponse({
        type: APIInternalServerErrorResponse,
    })
    // Function definition
    @Roles([DefinedRoles.User])
    @Get('user-endpoint')
    userEndpoint(): AuthInformationDto {
        const response: AuthInformationDto = {
            entity: {
                message:
                    'This is a user endpoint and requires the user to have a user role',
            },
        };

        return plainToInstance(AuthInformationDto, response);
    }

    @ApiOperation({
        summary:
            'Endpoint that can be accessed only with admin as well as user role',
        description:
            'To access this endpoint, actor must have both the user and admin roles',
    })
    @ApiUnauthorizedResponse({
        type: APIUnauthenticatedExceptionResponse,
    })
    @ApiForbiddenResponse({
        type: APIForbiddenExceptionResponse,
    })
    @ApiInternalServerErrorResponse({
        type: APIInternalServerErrorResponse,
    })
    // Function definition
    @Roles([DefinedRoles.User, DefinedRoles.Admin])
    @Get('user-admin-endpoint')
    userAndAdminEndpoint(): AuthInformationDto {
        const response: AuthInformationDto = {
            entity: {
                message:
                    'This is a user and admin endpoint and requires the user to have both the role',
            },
        };

        return plainToInstance(AuthInformationDto, response);
    }
}
