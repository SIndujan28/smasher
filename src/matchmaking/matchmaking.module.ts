import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [MatchmakingService],
  exports: [MatchmakingService]
})
export class MatchmakingModule {}
