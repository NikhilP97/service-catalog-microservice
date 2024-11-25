import { Controller, Post, Body, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Public } from '../decorators/is-public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { DefinedRoles } from 'src/types/auth.enum';
import { AuthService } from './auth.service';
import {
    AuthInformationDto,
    GenerateJwtDto,
    GenerateJwtResponse,
} from './dto/generate-jwt.dto';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('generate-jwt')
    async generateJwt(
        @Body() generateJwtDto: GenerateJwtDto,
    ): Promise<GenerateJwtResponse> {
        const jwtString = await this.authService.generateJwt(generateJwtDto);

        const response: GenerateJwtResponse = {
            access_token: jwtString,
        };

        return plainToInstance(GenerateJwtResponse, response);
    }

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
