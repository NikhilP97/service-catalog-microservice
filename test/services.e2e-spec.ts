import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { ServicesModule } from '../src/services/services.module';
import { ServiceEntity } from '../src/services/entities/service.entity';
import { VersionsEntity } from 'src/versions/entities/version.entity';
import { setup } from 'src/setup';

describe('ServicesController (e2e)', () => {
    let app: INestApplication;
    let serviceRepository: Repository<ServiceEntity>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ServicesModule,
                TypeOrmModule.forRoot({
                    // NOTE: A postgres DB with these connections must be running for the tests to work as expected
                    type: 'postgres',
                    host: 'localhost',
                    port: 5440,
                    username: 'test_postgres_user',
                    password: 'test_postgres_password',
                    database: 'test_service_catalog_pgdb',
                    entities: [ServiceEntity, VersionsEntity],
                    logging: false,
                    synchronize: true, // Automatically sync the schema for the test
                }),
                TypeOrmModule.forFeature([ServiceEntity, VersionsEntity]), // Include the repository for testing
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        // This needs to be done to enable global configs like path prefix, filters, pipes, etc.
        setup(app);
        await app.init();

        serviceRepository = moduleFixture.get<Repository<ServiceEntity>>(
            getRepositoryToken(ServiceEntity),
        );
    });

    // Clear the table after each test to keep them independent
    afterEach(async () => {
        await serviceRepository.query('DELETE FROM services');
        await serviceRepository.query('DELETE FROM versions');
    });

    // Close the app after all tests
    afterAll(async () => {
        await app.close();
    });

    it('should return the service by ID', async () => {
        // Arrange
        const testData = {
            name: 'Test Service Name',
            description: 'Test Service Description',
        };

        // Arrange: First create a new record in the DB by using the POST endpoint
        const createServiceResponse = await request(app.getHttpServer())
            .post('/api/v1/services')
            .send(testData)
            .expect(201); // Expect HTTP status 201 (Created)
        const createdService = createServiceResponse.body.data.entity;

        // Act: Call the getServiceById endpoint
        const getServiceByIdResponse = await request(app.getHttpServer())
            .get(`/api/v1/services/${createdService.id}`)
            .expect(200);

        // Assert: Validate the response
        expect(getServiceByIdResponse.body.data).toEqual({
            entity: {
                id: createdService.id,
                name: 'Test Service Name',
                description: 'Test Service Description',
                no_of_versions: 1,
            },
        });
    });
});
