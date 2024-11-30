/**
 * @fileoverview This contains the end-to-end tests for the services functionality
 * Pre-requisite: A running database to connect and test functionality
 * The test connects to a database passed through a config passed in the TypeOrmModule.forRoot()
 * After each test the database tables are cleared to ensure independence and deter side effects
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { ServicesModule } from '../src/services/services.module';
import { ServiceEntity } from '../src/services/entities/service.entity';
import { VersionsEntity } from 'src/versions/entities/version.entity';
import { setup } from 'src/setup';

describe('Services functionality (e2e)', () => {
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
                    // Automatically sync the schema for the test
                    synchronize: true,
                }),
                // Include the repository for testing
                TypeOrmModule.forFeature([ServiceEntity, VersionsEntity]),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        // The setup() method needs to be called to simulate the same conditions and configs that are enabled in the main application
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

    // Test getting the service information by passing the service ID
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
            .expect(201);
        const createdService = createServiceResponse.body.data.entity;

        // Act: Call the getServiceById endpoint with the create service response
        const getServiceByIdResponse = await request(app.getHttpServer())
            .get(`/api/v1/services/${createdService.id}`)
            .expect(200);

        // Assert: Validate the response of getting service info by id
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
