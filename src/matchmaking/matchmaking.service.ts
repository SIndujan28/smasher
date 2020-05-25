import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { WsException } from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class MatchmakingService {
    constructor(private redisService:RedisService) {}

    async hello() {
        console.log(this.redisService.sMembers("cadfadfafaf"))
    }

    async createGame(userId: string): Promise<any> {
        try {
            const gameId=uuidv4()
            await this.redisService.addMember(gameId, userId);
            return gameId;
        } catch(e) {
            throw new WsException('Error while creating game')
        }
    }

    async joinById(gameId: string, userId: string) {
        try{
            await this.redisService.addMember(gameId,userId)
            return "successfully joined to game"
        } catch(e) {
            throw new WsException('Unable to join to custom game')
        }
    }

    async matchRamdom(userId: string,) {
        try {
            
        } catch {
            throw new WsException('Internal server error')
        }
    }

    


}
