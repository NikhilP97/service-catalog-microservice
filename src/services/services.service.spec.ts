import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ServiceRequestParamsDto } from 'src/types/common.dto';
import { ServicesService } from './services.service';
import { ServiceEntity } from './entities/service.entity';
import {
    ServiceListRequestQuery,
    ServicePartialRequestBodyDto,
    ServiceRequestBodyDto,
} from './dto/services.dto';

const mockService: ServiceEntity = {
    id: 'mock-service-id',
    name: 'Mock Service',
    description: 'Mock service description',
    no_of_versions: 1,
    versions: [],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
};

describe('ServicesService', () => {
    let service: ServicesService;
    let serviceRepository: DeepMocked<Repository<ServiceEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ServicesService],
        })
            .useMocker(() => createMock())
            .compile();

        service = module.get<ServicesService>(ServicesService);
        serviceRepository = module.get(getRepositoryToken(ServiceEntity));
    });

    // Clean up mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests begin
    // Sanity check
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createService', () => {
        it('should validate and create a new service', async () => {
            // Arrange
            const createDto: ServiceRequestBodyDto = {
                name: 'Test Service',
                description: 'A test service',
            };
            serviceRepository.create.mockReturnValue(mockService);
            serviceRepository.save.mockResolvedValue(mockService);
            // jest.spyOn(validateOrReject, 'bind').mockResolvedValue(undefined);

            // Act
            const result = await service.createService(createDto);

            // Assert
            expect(serviceRepository.create).toHaveBeenCalledWith({
                ...createDto,
                versions: [
                    {
                        name: 'Initial Version',
                        overview: `Initial version of ${createDto.name}`,
                    },
                ],
            });
            expect(serviceRepository.save).toHaveBeenCalledWith(mockService);
            expect(result).toEqual(mockService);
        });
    });

    describe('getServiceById', () => {
        it('should return service if found', async () => {
            // Arrange
            const getParams: ServiceRequestParamsDto = {
                serviceId: 'mock-service-id',
            };
            serviceRepository.createQueryBuilder.mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue(mockService),
                getOne: jest.fn().mockResolvedValue(mockService),
            } as any);

            // Act
            const result = await service.getServiceById(getParams);

            // Assert
            expect(result).toEqual(mockService);
        });

        it('should throw NotFoundException if service is not found', async () => {
            // Arrange
            const getParams: ServiceRequestParamsDto = {
                serviceId: 'non-existing-id',
            };
            serviceRepository.createQueryBuilder.mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue(null),
                getOne: jest.fn().mockResolvedValue(null),
            } as any);

            // Act & Assert
            await expect(service.getServiceById(getParams)).rejects.toThrow(
                new NotFoundException('Service not found'),
            );
        });
    });

    describe('getServices', () => {
        it('should return paginated services', async () => {
            // Arrange
            const queryParams: ServiceListRequestQuery = {
                page: {
                    number: 1,
                    size: 20,
                },
            };
            serviceRepository.createQueryBuilder.mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([mockService]),
                getCount: jest.fn().mockResolvedValue(1),
            } as any);

            // Act
            const result = await service.getServices(queryParams);

            // Assert
            expect(result.services).toEqual([mockService]);
            expect(result.pagination.total_items).toEqual(1);
        });

        it('should return services filtered by searchTerm', async () => {
            // Arrange
            const queryParams: ServiceListRequestQuery = {
                page: {
                    number: 1,
                    size: 10,
                },
                searchTerm: 'Mock Service',
            };
            serviceRepository.createQueryBuilder.mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([mockService]),
                getCount: jest.fn().mockResolvedValue(1),
            } as any);

            // Act
            const result = await service.getServices(queryParams);

            // Assert
            expect(result.services).toEqual([mockService]);
            expect(result.pagination.total_items).toEqual(1);
        });

        it('should throw not found exception if no services were found', async () => {
            // Arrange
            const queryParams: ServiceListRequestQuery = {
                page: {
                    number: 1,
                    size: 10,
                },
            };
            serviceRepository.createQueryBuilder.mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([]),
                getCount: jest.fn().mockResolvedValue(1),
            } as any);

            // Act and Assert
            await expect(service.getServices(queryParams)).rejects.toThrow(
                new NotFoundException('No Services found'),
            );
        });
    });

    describe('updateService', () => {
        it('should update an existing service', async () => {
            // Arrange
            const updateParams: ServiceRequestParamsDto = {
                serviceId: 'mock-service-id',
            };
            const updateData: ServicePartialRequestBodyDto = {
                name: 'Updated Service',
            };
            mockService.name = updateData.name!;
            serviceRepository.findOne.mockResolvedValue(mockService);
            serviceRepository.update.mockResolvedValue(new UpdateResult());
            serviceRepository.createQueryBuilder.mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue(mockService),
                getOne: jest.fn().mockResolvedValue(mockService),
            } as any);

            // Act
            const result = await service.updateService(
                updateParams,
                updateData,
            );

            // Assert
            expect(serviceRepository.update).toHaveBeenCalledWith(
                'mock-service-id',
                updateData,
            );
            expect(result).toEqual(mockService);
        });

        it('should throw BadRequestException if the update data is empty', async () => {
            // Arrange
            const updateParams: ServiceRequestParamsDto = {
                serviceId: 'mock-service-id',
            };
            const updateData: ServicePartialRequestBodyDto = {};

            // Act & Assert
            await expect(
                service.updateService(updateParams, updateData),
            ).rejects.toThrow(
                new BadRequestException('Update data cannot be empty'),
            );
        });

        it('should throw NotFoundException if service does not exist', async () => {
            // Arrange
            const updateParams: ServiceRequestParamsDto = {
                serviceId: 'non-existing-id',
            };
            const updateData: ServicePartialRequestBodyDto = {
                name: 'Updated Service',
            };
            serviceRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(
                service.updateService(updateParams, updateData),
            ).rejects.toThrow(new NotFoundException('Service not found'));
        });
    });

    describe('deleteService', () => {
        it('should soft delete an existing service', async () => {
            // Arrange
            const deleteParams: ServiceRequestParamsDto = {
                serviceId: 'mock-service-id',
            };
            serviceRepository.findOne.mockResolvedValue(mockService);

            // Act
            await service.deleteService(deleteParams);

            // Assert
            expect(serviceRepository.softRemove).toHaveBeenCalledWith(
                mockService,
            );
        });

        it('should throw NotFoundException if service does not exist', async () => {
            // Arrange
            const deleteParams: ServiceRequestParamsDto = {
                serviceId: 'non-existing-id',
            };
            serviceRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.deleteService(deleteParams)).rejects.toThrow(
                new NotFoundException('Service not found'),
            );
        });
    });
});
