import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';

import { ServiceRequestParams } from './dto/shared';
import { ServiceEntity } from './entities/service.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import {
    ListServicesReqQueryDto,
    ListServicesResponseDto,
    CreateServiceReqBodyDto,
    CreateServiceResponseDto,
    UpdateServiceReqParamsDto,
    UpdateServiceReqBodyDto,
    UpdateServiceResponseDto,
    DeleteServiceReqParamsDto,
} from './dto';

const mockServiceEntity: ServiceEntity = {
    id: '1',
    name: 'Test Service',
    description: 'Mock service description',
    no_of_versions: 1,
    versions: [],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
};
const mockServicesResponse: ListServicesResponseDto = {
    entities: [mockServiceEntity],
    meta: {
        pagination: {
            total_items: 1,
            cur_page: 1,
            page_size: 10,
            total_pages: 1,
        },
    },
};
const mockCreateServiceResponse: CreateServiceResponseDto = {
    entity: mockServiceEntity,
};
const mockUpdateServiceResponse: UpdateServiceResponseDto = {
    entity: mockServiceEntity,
};

describe('ServicesController', () => {
    let servicesController: ServicesController;
    let servicesService: DeepMocked<ServicesService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServicesController],
        })
            .useMocker(createMock)
            .compile();

        servicesController = module.get<ServicesController>(ServicesController);
        servicesService = module.get(ServicesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should be defined', () => {
        expect(servicesController).toBeDefined();
    });

    describe('createService', () => {
        it('Should create a service', async () => {
            // Arrange
            const reqBody: CreateServiceReqBodyDto = {
                name: 'Test Service',
                description: 'Mock service description',
            };
            servicesService.createService.mockResolvedValue(mockServiceEntity);

            // Act
            const result = await servicesController.createService(reqBody);

            // Assert
            expect(servicesService.createService).toHaveBeenCalledWith(reqBody);
            expect(result).toEqual(mockCreateServiceResponse);
        });
    });

    describe('findServices', () => {
        it('Should return a list of services', async () => {
            // Arrange
            const reqQuery: ListServicesReqQueryDto = {
                'page[number]': 1,
                'page[size]': 10,
            };
            servicesService.getServices.mockResolvedValue({
                services: [mockServiceEntity],
                pagination: {
                    total_items: 1,
                    cur_page: 1,
                    page_size: 10,
                    total_pages: 1,
                },
            });

            // Act
            const result = await servicesController.findServices(reqQuery);

            // Assert
            expect(servicesService.getServices).toHaveBeenCalledWith(reqQuery);
            expect(result).toEqual(mockServicesResponse);
        });
    });

    describe('getService', () => {
        it('Should return a service by ID', async () => {
            // Arrange
            const reqParams: ServiceRequestParams = { serviceId: '1' };
            servicesService.getServiceById.mockResolvedValue(mockServiceEntity);

            // Act
            const result = await servicesController.getService(reqParams);

            // Assert
            expect(servicesService.getServiceById).toHaveBeenCalledWith(
                reqParams,
            );
            expect(result).toEqual({ entity: mockServiceEntity });
        });
    });

    describe('updateService', () => {
        it('Should update a service with valid data', async () => {
            // Arrange
            const reqParams: UpdateServiceReqParamsDto = { serviceId: '1' };
            const reqBody: UpdateServiceReqBodyDto = {
                name: 'Updated Service',
            };
            servicesService.updateService.mockResolvedValue(mockServiceEntity);

            // Act
            const result = await servicesController.updateService(
                reqParams,
                reqBody,
            );

            // Assert
            expect(servicesService.updateService).toHaveBeenCalledWith(
                reqParams,
                reqBody,
            );
            expect(result).toEqual(mockUpdateServiceResponse);
        });

        it('Should throw BadRequestException if update data is empty', async () => {
            // Arrange
            const reqParams: UpdateServiceReqParamsDto = { serviceId: '1' };
            const reqBody: UpdateServiceReqBodyDto = {};

            // Act & Assert
            await expect(
                servicesController.updateService(reqParams, reqBody),
            ).rejects.toThrow(
                new BadRequestException('Update data cannot be empty'),
            );
            expect(servicesService.updateService).not.toHaveBeenCalled();
        });
    });

    describe('deleteService', () => {
        it('Should delete a service by ID', async () => {
            // Arrange
            const reqParams: DeleteServiceReqParamsDto = { serviceId: '1' };
            servicesService.deleteService.mockResolvedValue();

            // Act
            const result = await servicesController.deleteService(reqParams);

            // Assert
            expect(servicesService.deleteService).toHaveBeenCalledWith(
                reqParams,
            );
            expect(result).toBeUndefined();
        });
    });
});
