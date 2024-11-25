import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VersionsService } from './versions.service';
import { VersionsEntity } from './entities/version.entity';

describe('VersionsService', () => {
    let service: VersionsService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let versionRepository: DeepMocked<Repository<VersionsEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VersionsService],
        })
            .useMocker(() => createMock())
            .compile();

        service = module.get<VersionsService>(VersionsService);
        versionRepository = module.get(getRepositoryToken(VersionsEntity));
    });

    // Clean up mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
