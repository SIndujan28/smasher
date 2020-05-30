import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuidv4 } from 'uuid'
import {isEmpty,isUndefined,uniq,now,trim,isString,indexOf,intersection} from 'lodash'


@Injectable()
export class MatchmakingService {
    constructor(private redisService:RedisService) {}

    static readonly pendingKey="events/pending"
    static readonly activeKey="events/active"

    async createEvent(obj) {
        const userId=obj.userId
        const userAlias=obj.userAlias
        if( isUndefined(userId) ||  isUndefined(userAlias)) {
            return Promise.reject(new Error('user required'))
        }
        const capacity=Math.max(2, parseInt(obj.capacity,10) || 0)
        const whiteList= uniq(obj.whiteList || [])
        const blackList= uniq(obj.blackList || [])
        if( indexOf(whiteList,userId) != -1 ||  indexOf(blackList,userId) != -1 || ! isEmpty( intersection(whiteList,blackList))) {
            return Promise.reject(new Error('invalid whitelist/blacklist'))
        }
        const perUserTimeoutSec = Math.max(1, parseInt(obj.perUserTimeoutSec, 10) || 30)
        const params = obj.params || ''
        if (! isString(params)) {
            return Promise.reject(new Error('invalid params'))
        }
        const event = {
            id: uuidv4(),
            capacity,
            params:  trim(params),
            whiteList,
            blackList,
            userIds: [userId],
            aliases: [userAlias]
          }
        return this.redisService.createEvent(`events/${event.id}`, MatchmakingService.pendingKey, JSON.stringify(event))
                .then(() => {
                    const timeout=event.capacity * perUserTimeoutSec * 1000
                    setTimeout(function autoCancelEvent() {
                        // this.redisService.cancelEvent(userId, event.id).catch(err => {
                        //     console.log(err)
                        // })
                    }, timeout)
                    return event
                })
    }

    async autojoinEvent(obj) {
        const userId=obj.userId
        const userAlias=obj.userAlias
        if( isUndefined(userId) ||  isUndefined(userAlias)) {
            return Promise.reject(new Error('user required'))
        }
        const capacity=Math.max(2, parseInt(obj.capacity,10) || 0)
        const params=obj.params || ''
        if(! isString(params)) {
            return Promise.reject(new Error('invalid params'))
        }
        return this.redisService.autoJoinEvent(
            MatchmakingService.pendingKey,
            MatchmakingService.activeKey,
            userId,
            userAlias,
            capacity,
            params,
             now() / 1000 | 0
        ).then(json => !json ? null : JSON.parse(json))
    }

    async cancelEvent(userId, eventId) {
        return this.redisService.cancelEvent(`events/${eventId}`, MatchmakingService.pendingKey, userId)
    }

    async joinEvent(userId, userAlias, eventId) {
        return this.redisService.joinEvent(`events/${eventId}`,MatchmakingService.pendingKey,MatchmakingService.activeKey,userId,userAlias,now() / 1000 | 0).then(JSON.parse)
    }

    async getEventsFor(userId) {
        return this.redisService.getPendingEventsFor(MatchmakingService.pendingKey, userId).then((json) => {
          const pendingEvents = JSON.parse(json)
          return Promise.all([this.redisService.getActiveEventsFor(MatchmakingService.activeKey, userId),pendingEvents])
        }).then(([json,pendingEvents])=> {
          return {
            pending: pendingEvents,
            active: JSON.parse(json)
          }
        })
      }






    


}
