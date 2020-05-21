import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}