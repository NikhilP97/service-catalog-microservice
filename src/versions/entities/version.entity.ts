/**
 * @fileoverview Column definitions for the versions table
 */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
} from 'typeorm';

import { ServiceEntity } from 'src/services/entities/service.entity';

@Entity('versions')
export class VersionsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    overview: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Index()
    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;

    @Index()
    @ManyToOne(() => ServiceEntity, (service) => service.versions, {
        onDelete: 'CASCADE', // ensure related versions are deleted when the service is deleted
    })
    // Explicitly define the foreign key name
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;
}
