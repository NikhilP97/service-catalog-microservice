import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GenerateJwtDto } from './dto/generate-jwt.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async generateJwt(generateJwtDto: GenerateJwtDto): Promise<string> {
        validateOrReject(generateJwtDto);

        const payload = {
            sub: generateJwtDto.user_id,
            roles: generateJwtDto.roles,
        };

        return await this.jwtService.signAsync(payload);
    }
}
