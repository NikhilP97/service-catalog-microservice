import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Entity,
    Index,
} from 'typeorm';

import { VersionsEntity } from 'src/versions/entities/version.entity';
import { Page } from 'src/types/common.dto';

@Entity('services')
@Index('idx_service_name_description', ['name', 'description']) // Composite index
export class ServiceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Index()
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Index()
    @DeleteDateColumn({ nullable: true })
    deleted_at: Date | null; // Automatically set null when `softDelete` is called

    @OneToMany(() => VersionsEntity, (version) => version.service, {
        cascade: true,
    })
    versions: VersionsEntity[];

    // Calculated property, not persisted in the database
    no_of_versions: number;
}

export class ServiceEntitiesWithPagination {
    services: ServiceEntity[];

    pagination: Page;
}
