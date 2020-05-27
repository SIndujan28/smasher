import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MatchmakingModule } from 'src/matchmaking/matchmaking.module';

@Module({
    imports:[MatchmakingModule],
    providers:[EventsGateway]
})
export class EventsModule {}
