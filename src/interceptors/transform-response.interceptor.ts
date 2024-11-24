import {
    CallHandler,
    ClassSerializerInterceptorOptions,
    ExecutionContext,
    Injectable,
    ClassSerializerInterceptor,
    PlainLiteralObject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { APISuccessResponse } from 'src/types/common.dto';

@Injectable()
export class TransformResponseInterceptor extends ClassSerializerInterceptor {
    constructor(
        reflector: Reflector,
        defaultOptions?: ClassSerializerInterceptorOptions,
    ) {
        // First serialize and strip values that are not exposed
        super(reflector, defaultOptions);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Then transform the response by adding additional keys at the top level
        return super.intercept(context, next).pipe(
            map(
                (
                    response: PlainLiteralObject,
                ): APISuccessResponse<PlainLiteralObject> => ({
                    status_code: context.switchToHttp().getResponse()
                        .statusCode,
                    data: response, // Wrap the serialized response under 'data'
                }),
            ),
        );
    }
}
