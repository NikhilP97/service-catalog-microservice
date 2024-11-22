import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { ServicesController } from './services.controller';
// import { ServicesService } from './services.service';
import {
    CreateServiceRequestDto,
    GetServiceRequestDto,
    ListServicesRequestDto,
    UpdateServiceRequestBodyDto,
} from './dto';

describe('ServicesController', () => {
    let servicesController: ServicesController;
    // let servicesService: DeepMocked<ServicesService>;

    // Set up testbed before each test
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServicesController],
        })
            .useMocker(createMock)
            .compile();

        servicesController = module.get<ServicesController>(ServicesController);
        // servicesService = module.get(ServicesService);
    });

    // Clean up mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Sanity test
    it('should be defined', () => {
        expect(servicesController).toBeDefined();
    });

    // Test for POST /services
    describe('Create a new service', () => {
        it('Should return the details of the new service', async () => {
            // Arrange
            const createServiceReq: CreateServiceRequestDto = {
                name: 'New Service',
                description: 'New Service Description',
            };

            // Act
            const result =
                await servicesController.createService(createServiceReq);

            // Assert
            // expect(userService.findAll).toHaveBeenCalled();
            expect(result).toEqual({
                service_entity: {
                    ...createServiceReq,
                    service_id: '1',
                },
            });
        });

        /*
        it('Should throw a not found if service entity details are not returned', async () => {
            // Arrange
            const createServiceReq: CreateServiceRequestDto = {};

            // Act
            const result = await servicesController.create(createServiceReq);

            // Assert
            // expect(userService.findAll).toHaveBeenCalled();
            expect(result).toEqual({
                service_entity: {
                    ...createServiceReq,
                    service_id: 1,
                },
            });
        });
         */
    });

    // Test for GET /services
    describe('Get list of service', () => {
        it('Should return the list of services', async () => {
            // Arrange
            const queryParams: ListServicesRequestDto = {};

            // Act
            const result = await servicesController.findServices(queryParams);

            // Assert
            // expect(userService.findAll).toHaveBeenCalled();
            expect(result).toEqual({
                service_entities: [
                    {
                        name: 'New Service',
                        description: 'New Service Description',
                        service_id: '1',
                    },
                ],
                meta: {
                    pagination: {
                        cur_page: 1,
                        page_size: 1,
                        total_pages: 1,
                        total_items: 1,
                    },
                },
            });
        });
    });

    // Test for GET /services/{serviceId}
    describe('Get one a service by service ID', () => {
        it('Should return the details of the service', async () => {
            // Arrange
            const queryParams: GetServiceRequestDto = {
                serviceId: '1923012',
            };

            // Act
            const result = await servicesController.getService(queryParams);

            // Assert
            // expect(userService.findAll).toHaveBeenCalled();
            expect(result).toEqual({
                service_entity: {
                    name: 'New Service',
                    description: 'New Service Description',
                    service_id: queryParams.serviceId,
                },
            });
        });
    });

    // Test for PATCH /services/{serviceId}
    describe('Update one a service by service ID and request body', () => {
        it('Should return the details of the service', async () => {
            // Arrange
            const queryParams: GetServiceRequestDto = {
                serviceId: '1923012',
            };

            const updateServiceReqBody: UpdateServiceRequestBodyDto = {
                name: 'New Service',
                description: 'New Service Description',
            };

            // Act
            const result = await servicesController.updateService(
                queryParams,
                updateServiceReqBody,
            );

            // Assert
            // expect(userService.findAll).toHaveBeenCalled();
            expect(result).toEqual({
                service_entity: {
                    ...updateServiceReqBody,
                    service_id: queryParams.serviceId,
                },
            });
        });
    });

    // Test for DELETE /services/{serviceId}
    describe('Delete one a service by service ID ', () => {
        it('Should delete the service', async () => {
            // Arrange
            const queryParams: GetServiceRequestDto = {
                serviceId: '2830120',
            };

            // Act
            const result = await servicesController.deleteService(queryParams);

            // Assert
            // expect(userService.findAll).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });
    });
});
