import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import { isEmptyValue } from 'src/utility/validations';
import { VersionsEntity } from './entities/version.entity';
import {
    CreateVersionReqBodyDto,
    CreateVersionReqParamsDto,
    DeleteVersionReqParamsDto,
    GetVersionReqParamsDto,
    ListVersionsReqParamsDto,
    UpdateVersionReqBodyDto,
    UpdateVersionReqParamsDto,
} from './dto';

@Injectable()
export class VersionsService {
    constructor(
        @InjectRepository(VersionsEntity)
        private readonly versionRepository: Repository<VersionsEntity>,
    ) {}

    private async checkIfServiceExists(serviceId: string): Promise<void> {
        // Check if the service exists by counting versions with the service_id
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

    // Create a new version for a service
    async createVersion(
        requestParams: CreateVersionReqParamsDto,
        requestBody: CreateVersionReqBodyDto,
    ): Promise<VersionsEntity> {
        await validateOrReject(requestParams);

        await validateOrReject(requestBody);

        const { serviceId } = requestParams;

        await this.checkIfServiceExists(serviceId);

        const version = this.versionRepository.create({
            ...requestBody,
            service: { service_id: serviceId }, // Associate version with the service
        });

        return await this.versionRepository.save(version);
    }

    // Get all versions of a service
    // Does not implement pagination to keep it simple.
    async getVersionsByServiceId(
        requestParams: ListVersionsReqParamsDto,
    ): Promise<VersionsEntity[]> {
        await validateOrReject(requestParams);

        const { serviceId } = requestParams;

        const versions = await this.versionRepository
            .createQueryBuilder('versions')
            .leftJoinAndSelect('versions.service', 'service')
            .where('versions.service.service_id = :serviceId', { serviceId })
            .andWhere('versions.deleted_at IS NULL')
            .getMany();

        // TODO: Double check if its needed to move this logic
        if (isEmptyValue(versions)) {
            throw new NotFoundException(
                'No versions found for the service. Check if the service_id is valid',
            );
        }

        return versions;
    }

    // Get a version by id
    async getVersionById(
        requestParams: GetVersionReqParamsDto,
    ): Promise<VersionsEntity> {
        await validateOrReject(requestParams);

        const { versionId } = requestParams;

        const version = await this.versionRepository
            .createQueryBuilder('versions')
            .where('versions.version_id = :versionId', { versionId })
            .andWhere('versions.deleted_at IS NULL')
            .getOne();

        if (!version) {
            throw new NotFoundException('Version not found');
        }

        return version;
    }

    // Update a version
    async updateVersion(
        requestParams: UpdateVersionReqParamsDto,
        requestBody: UpdateVersionReqBodyDto,
    ): Promise<VersionsEntity> {
        await validateOrReject(requestParams);

        await validateOrReject(requestBody);

        if (isEmptyValue(requestBody)) {
            throw new BadRequestException('Update data cannot be empty');
        }

        const { versionId } = requestParams;

        const version = await this.versionRepository.findOne({
            where: { version_id: versionId, deleted_at: IsNull() },
        });

        if (!version) {
            throw new NotFoundException('Version not found');
        }

        await this.versionRepository.update(versionId, requestBody);

        return await this.getVersionById(requestParams);
    }

    // Delete a version
    async deleteVersion(
        requestParams: DeleteVersionReqParamsDto,
    ): Promise<void> {
        await validateOrReject(requestParams);

        const { versionId, serviceId } = requestParams;

        // Check if the version exists
        const version = await this.versionRepository.findOne({
            where: { version_id: versionId, deleted_at: IsNull() },
        });

        if (!version) {
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
