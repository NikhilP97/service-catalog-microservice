/**
 * @fileoverview Core business logic for the services entity
 */
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import { IsNull, Repository } from 'typeorm';

import { isEmptyValue } from 'src/utils';
import { ServiceEntity } from './entities/service.entity';
import {
    ServiceEntitiesWithPagination,
    ServiceListRequestQuery,
    ServicePartialRequestBodyDto,
    ServiceRequestBodyDto,
    ServiceRequestParamsDto,
} from './dto/services.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
    ) {}

    async createService(
        requestBody: ServiceRequestBodyDto,
    ): Promise<ServiceEntity> {
        await validateOrReject(requestBody);

        const newService = this.serviceRepository.create({
            ...requestBody,
            versions: [
                {
                    name: 'Initial Version',
                    overview: `Initial version of ${requestBody.name}`,
                },
            ],
        });
        newService.no_of_versions = 1;

        return await this.serviceRepository.save(newService);
    }

    async getServiceById(
        requestParams: ServiceRequestParamsDto,
    ): Promise<ServiceEntity> {
        await validateOrReject(requestParams);

        const { serviceId } = requestParams;
        const service = await this.serviceRepository
            .createQueryBuilder('service')
            .leftJoin('service.versions', 'version')
            .select('service.*')
            .addSelect('COUNT(version.id)::int', 'no_of_versions')
            .where('service.id = :serviceId', { serviceId })
            .andWhere('service.deleted_at IS NULL')
            .andWhere('version.deleted_at IS NULL')
            .groupBy('service.id')
            .getRawOne();

        if (isEmptyValue(service)) {
            throw new NotFoundException('Service not found');
        }

        return service;
    }

    async getServices(
        requestParams: ServiceListRequestQuery | undefined,
    ): Promise<ServiceEntitiesWithPagination> {
        if (requestParams) {
            await validateOrReject(requestParams);
        }

        const {
            'page[number]': pageNumber = 1,
            'page[size]': pageSize = 20,
            searchTerm,
            order = 'DESC',
            sortBy = 'created_at',
        } = requestParams!;
        const queryBuilder = this.serviceRepository
            .createQueryBuilder('service')
            .leftJoin('service.versions', 'version')
            .select('service.*')
            .addSelect('COUNT(version.id)::int', 'no_of_versions')
            .where('service.deleted_at IS NULL')
            .andWhere('version.deleted_at IS NULL')
            .groupBy('service.id');

        // Apply search term filter if provided
        if (searchTerm) {
            queryBuilder.where(
                `service.name ILIKE :searchTerm OR service.description ILIKE :searchTerm`,
                { searchTerm: `%${searchTerm}%` },
            );
        }

        // Apply sorting by 'sortBy' and 'order' fields
        queryBuilder.orderBy(`service.${sortBy}`, order, 'NULLS LAST');

        // Implement pagination
        queryBuilder.skip((pageNumber - 1) * pageSize).take(pageSize);

        const [services, totalItems] = await Promise.all([
            queryBuilder.getRawMany(),
            this.serviceRepository
                .createQueryBuilder('service')
                .leftJoin('service.versions', 'version')
                .addSelect('COUNT(version.id) ::int', 'no_of_versions')
                .groupBy('service.id')
                .getCount(),
        ]);

        if (isEmptyValue(services)) {
            throw new NotFoundException('No Services found');
        }

        const totalPages = Math.ceil(totalItems / pageSize);
        const pagination = {
            cur_page: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
        };

        return { services, pagination };
    }

    async updateService(
        requestParams: ServiceRequestParamsDto,
        updateData: ServicePartialRequestBodyDto,
    ): Promise<ServiceEntity> {
        await validateOrReject(requestParams);

        if (isEmptyValue(updateData)) {
            throw new BadRequestException('Update data cannot be empty');
        }

        await validateOrReject(updateData);

        const { serviceId } = requestParams;
        const serviceEntity = await this.serviceRepository.findOne({
            where: { id: serviceId, deleted_at: IsNull() },
        });

        if (isEmptyValue(serviceEntity)) {
            throw new NotFoundException('Service not found');
        }

        await this.serviceRepository.update(serviceId, updateData);
        return await this.getServiceById(requestParams);
    }

    async deleteService(requestParams: ServiceRequestParamsDto): Promise<void> {
        const { serviceId } = requestParams;

        const serviceToDelete = await this.serviceRepository.findOne({
            where: { id: serviceId, deleted_at: IsNull() },
            relations: ['versions'],
        });

        if (!serviceToDelete) {
            throw new NotFoundException('Service not found');
        }

        await this.serviceRepository.softRemove(serviceToDelete);
        return;
    }
}
