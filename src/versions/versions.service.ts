/**
 * @fileoverview Core business logic for the versions entity
 */
import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import { isEmptyValue } from 'src/utils';
import { ServiceRequestParamsDto } from 'src/types/common.dto';
import { VersionsEntity } from './entities/version.entity';
import {
    VersionPartialReqBodyDto,
    VersionRequestBodyDto,
    VersionRequestParamsDto,
} from './dto/versions.dto';

@Injectable()
export class VersionsService {
    constructor(
        @InjectRepository(VersionsEntity)
        private readonly versionRepository: Repository<VersionsEntity>,
    ) {}

    private async checkIfServiceExists(serviceId: string): Promise<void> {
        // Check if the service exists by counting the number of versions with the service.id
        const serviceExists = await this.versionRepository
            .createQueryBuilder('version')
            .where('version.service_id = :service_id', {
                service_id: serviceId,
            })
            .andWhere('version.deleted_at IS NULL') // Consider only non-soft-deleted entries
            .getCount();

        if (!serviceExists) {
            throw new NotFoundException('Service not found');
        }
    }

    // Create a new version for a given service
    async createVersion(
        requestParams: ServiceRequestParamsDto,
        requestBody: VersionRequestBodyDto,
    ): Promise<VersionsEntity> {
        // Validate input
        await validateOrReject(requestParams);
        await validateOrReject(requestBody);

        // Check if service exists
        const { serviceId } = requestParams;
        await this.checkIfServiceExists(serviceId);

        // Create entry in DB
        const version = this.versionRepository.create({
            ...requestBody,
            service: { id: serviceId }, // Associate version with the service
        });

        return await this.versionRepository.save(version);
    }

    /**
     * Get all versions of a service
     * Does not implement pagination currently
     */
    async getVersionsByServiceId(
        requestParams: ServiceRequestParamsDto,
    ): Promise<VersionsEntity[]> {
        // Validate input
        await validateOrReject(requestParams);

        const { serviceId } = requestParams;

        const versions = await this.versionRepository
            .createQueryBuilder('versions')
            .leftJoinAndSelect('versions.service', 'service')
            .where('versions.service.id = :serviceId', { serviceId })
            .andWhere('versions.deleted_at IS NULL')
            .getMany();

        if (isEmptyValue(versions)) {
            throw new NotFoundException(
                'No versions found for the service. Check if the service_id is valid',
            );
        }

        return versions;
    }

    async getVersionById(
        requestParams: VersionRequestParamsDto,
    ): Promise<VersionsEntity> {
        // Validate input
        await validateOrReject(requestParams);

        const { versionId } = requestParams;
        const version = await this.versionRepository
            .createQueryBuilder('versions')
            .where('versions.id = :versionId', { versionId })
            .andWhere('versions.deleted_at IS NULL')
            .getOne();

        if (!version) {
            throw new NotFoundException('Version not found');
        }

        return version;
    }

    async updateVersion(
        requestParams: VersionRequestParamsDto,
        requestBody: VersionPartialReqBodyDto,
    ): Promise<VersionsEntity> {
        // Validate input
        await validateOrReject(requestParams);
        await validateOrReject(requestBody);

        if (isEmptyValue(requestBody)) {
            throw new BadRequestException('Update data cannot be empty');
        }

        const { versionId } = requestParams;
        const version = await this.versionRepository.findOne({
            where: { id: versionId, deleted_at: IsNull() },
        });

        if (isEmptyValue(version)) {
            throw new NotFoundException('Version not found');
        }

        await this.versionRepository.update(versionId, requestBody);
        return await this.getVersionById(requestParams);
    }

    async deleteVersion(requestParams: VersionRequestParamsDto): Promise<void> {
        // Validate input
        await validateOrReject(requestParams);

        const { versionId, serviceId } = requestParams;
        // Check if the version exists
        const version = await this.versionRepository.findOne({
            where: { id: versionId, deleted_at: IsNull() },
        });

        if (isEmptyValue(version)) {
            throw new NotFoundException('Version not found');
        }

        // Check if this is the only version for the service
        const versionCount = await this.versionRepository
            .createQueryBuilder('version')
            .where('version.service_id = :service_id', {
                service_id: serviceId,
            })
            .andWhere('version.deleted_at IS NULL') // Only non-deleted versions
            .getCount();

        if (versionCount <= 1) {
            throw new ConflictException(
                'Cannot delete the only version of the service',
            );
        }

        // Perform soft delete of the version
        await this.versionRepository.softDelete(versionId);
    }
}
