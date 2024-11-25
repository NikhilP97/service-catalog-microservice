import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let authService: DeepMocked<AuthService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
        })
            .useMocker(createMock)
            .compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
