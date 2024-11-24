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

import { ServiceEntity } from '../../services/entities/service.entity';

@Entity('versions')
export class VersionsEntity {
    @PrimaryGeneratedColumn('uuid')
    version_id: string;

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
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'service_id' }) // Explicitly define the foreign key name
    service: ServiceEntity;
}
