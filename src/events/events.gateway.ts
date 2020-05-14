import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server } from 'socket.io'

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

    @SubscribeMessage('event')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
      console.log(data)  
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log(data)
    return data;
  }

}