import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from  '@nestjs/typeorm'
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            name: 'postgres',
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'smasher',
            synchronize: true,
            dropSchema: false,
            logging: true,
            entities: ['dist/**/*.entity.js']
        }
    }
}