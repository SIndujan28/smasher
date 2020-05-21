import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database-connection.service';
import { EventsModule } from './events/events.module';
import { MatchmakerModule } from './matchmaker/matchmaker.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
    useClass: DatabaseConnectionService
  }),
  AuthModule,
   EventsModule,
  MatchmakerModule,
  RedisModule],
})
export class AppModule {}
