import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse, ConnectedSocket } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import { MatchmakingService } from 'src/matchmaking/matchmaking.service';
import { CreateGameDto,AutoJoinGameDto, JoinByIdDto, CancelGameDto, GameDataDto } from './events.dto';


@WebSocketGateway(
    {namespace: 'events'}
    )
export class EventsGateway {
  constructor(private matchMaking:MatchmakingService) {}
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
      console.log(data)
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log(data)
    return data;
  }

   @SubscribeMessage('game-data')
  async gameData(@MessageBody() {roomId,gameData}: GameDataDto, @ConnectedSocket() client: Socket) {
    client.to(roomId).emit(gameData)
    console.log("*"+client.rooms)
  }

   @SubscribeMessage('create-game')
  async createGame(@MessageBody() createGameDto: CreateGameDto) {
    return this.matchMaking.createEvent(createGameDto).then((data1) =>{ 
      return data1
    } ).catch(err => {console.log(err)})
  }

   @SubscribeMessage('autojoin-game')
  async autoJoin(@MessageBody() autoJoinGameDto: AutoJoinGameDto) {
    return this.matchMaking.autojoinEvent(autoJoinGameDto).then((data1) =>{ 
      console.log("isdk"+data1)
      return data1
    } ).catch(err => {console.log(err)})
  }

   @SubscribeMessage('joinById-game')
  async joinById(@MessageBody() {userId, userAlias, eventId}: JoinByIdDto) {
    return this.matchMaking.joinEvent(userId,userAlias,eventId).then((data1) =>{ return data1} ).catch(err => {console.log(err)})
  }

   @SubscribeMessage('join-room')
  async joinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId,(err) => {
      if(err) {
        console.log(err)
      }
    })
  }

   @SubscribeMessage('cancel-game')
  async cancelGame(@MessageBody() {userId,eventId}: CancelGameDto) {
    return this.matchMaking.cancelEvent(userId,eventId).then((data1) =>{ return data1} ).catch(err => {console.log(err)})
  }

   @SubscribeMessage('game-info')
  async getGameInfo(@MessageBody() userId: string) {
    return this.matchMaking.getEventsFor(userId).then((data1) =>{ 
      console.log(data1)
      return data1
    } ).catch(err => {console.log(err)})
  }
   @SubscribeMessage('leave-room')
  async leaveRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId,(err) => {
      if(err) {
        console.log(err)
      }
    })
  }
}