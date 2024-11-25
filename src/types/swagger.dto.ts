import { ApiProperty } from '@nestjs/swagger';
import { APIErrorResponse } from './common.dto';

export class APIUnauthenticatedExceptionResponse extends APIErrorResponse {
    @ApiProperty({
        description: 'http status code',
        example: 401,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Human readable message of the error',
        example: 'You are not authenticated. Please sign in and try again.',
    })
    title: string;

    @ApiProperty({
        description: 'Type of the http exception',
        example: 'UnauthorizedException',
    })
    type: string;

    @ApiProperty({
        description: 'Details about the error',
        example: '["JWT token has expired"]',
    })
    details?: undefined | string[];
}

export class APIForbiddenExceptionResponse extends APIErrorResponse {
    @ApiProperty({
        description: 'http status code',
        example: 403,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Human readable message of the error',
        example:
            'You do not have sufficient permissions to carry out this action',
    })
    title: string;

    @ApiProperty({
        description: 'Type of the http exception',
        example: 'ForbiddenException',
    })
    type: string;

    @ApiProperty({
        description: 'Details about the error',
        example:
            '["User does not have the required roles to perform this action"]',
    })
    details?: undefined | string[];
}

export class APINotFoundErrorResponse extends APIErrorResponse {
    @ApiProperty({
        description: 'http status code',
        example: 404,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Human readable message of the error',
        example: 'No services found',
    })
    title: string;

    @ApiProperty({
        description: 'Type of the http exception',
        example: 'NotFoundException',
    })
    type: string;

    @ApiProperty({
        description: 'Details about the error',
        example: '["Could not find any results for the given resource"]',
    })
    details?: undefined | string[];
}

export class APIConflictExceptionResponse extends APIErrorResponse {
    @ApiProperty({
        description: 'http status code',
        example: 409,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Human readable message of the error',
        example: 'Cannot execute the given action',
    })
    title: string;

    @ApiProperty({
        description: 'Type of the http exception',
        example: 'ConflictException',
    })
    type: string;

    @ApiProperty({
        description: 'Details about the error',
        example:
            '["Cannot delete the only version associated with the service "]',
    })
    details?: undefined | string[];
}

export class APIInternalServerErrorResponse extends APIErrorResponse {
    @ApiProperty({
        description: 'http status code',
        example: 500,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Human readable message of the error',
        example: 'An unexpected error occurred. Please try again later.',
    })
    title: string;

    @ApiProperty({
        description: 'Type of the http exception',
        example: 'InternalServerErrorException',
    })
    type: string;

    @ApiProperty({
        description: 'Details about the error',
        example: '["could not access property name of undefined"]',
    })
    details?: undefined | string[];
}
