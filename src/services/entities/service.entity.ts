export class ServiceEntity {
    service_id: string;

    // @Column({ type: 'varchar', length: 255 })
    name: string;

    // @Column({ type: 'text', nullable: true })
    description: string;

    // @CreateDateColumn()
    created_at: Date;

    // @UpdateDateColumn()
    updated_at: Date;

    // @DeleteDateColumn({ nullable: true })
    deleted_at: Date; // Automatically set when `softDelete` is called

    constructor(partialService?: Partial<ServiceEntity>) {
        if (partialService) {
            Object.assign(this, partialService);
        }
    }
}
