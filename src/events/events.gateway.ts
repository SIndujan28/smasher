import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse, ConnectedSocket } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'

@WebSocketGateway(
    {namespace: 'events'}
    )
export class EventsGateway {
    @WebSocketServer()
    server: Server;

        // @SubscribeMessage('events')
        // handleEvent(@MessageBody() data:string): string {
        //     console.log(data)
        //     return data;
        // }

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
  async gameData(@MessageBody() data: any) {

  }

  @SubscribeMessage('join-room')
  async joinRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.join(data,(err) => {
      if(err) {
        console.log(err)
      }
    })
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.leave(data,(err) => {
      if(err) {
        console.log(err)
      }
    })
  }
}