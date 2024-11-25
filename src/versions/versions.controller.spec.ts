import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { VersionsController } from './versions.controller';
import { VersionsService } from './versions.service';

describe('VersionsController', () => {
    let controller: VersionsController;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let versionsService: DeepMocked<VersionsService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VersionsController],
        })
            .useMocker(createMock)
            .compile();

        controller = module.get<VersionsController>(VersionsController);
        versionsService = module.get(VersionsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
