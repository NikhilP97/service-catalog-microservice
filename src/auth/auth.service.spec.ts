import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let jwtService: DeepMocked<JwtService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        })
            .useMocker(() => createMock())
            .compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);
    });

    // Clean up mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
