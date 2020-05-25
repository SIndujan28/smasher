import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database-connection.service';
import { EventsModule } from './events/events.module';
import { RedisModule } from './redis/redis.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
    useClass: DatabaseConnectionService
  }),
  AuthModule,
  EventsModule,
  RedisModule,
  MatchmakingModule],
})
export class AppModule {}
