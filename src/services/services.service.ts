import { Injectable } from '@nestjs/common';

import { CreateServiceRequestDto, UpdateServiceRequestBodyDto } from './dto';

@Injectable()
export class ServicesService {
    create(createServiceReqDto: CreateServiceRequestDto) {
        return 'This action adds a new service';
    }

    findAll() {
        return 'This action fins all services';
    }

    findOne(id: number) {
        return `This action returns a #${id} service`;
    }

    update(id: number, updateServiceReqBodyDto: UpdateServiceRequestBodyDto) {
        return `This action updates a #${id} service`;
    }

    remove(id: number) {
        return `This action removes a #${id} service`;
    }
}
