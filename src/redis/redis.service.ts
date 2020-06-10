import { Injectable } from '@nestjs/common';
import {createClient} from 'redis'
import { promisify } from 'util';

@Injectable()
export class RedisService {

    private readonly client=createClient({"host":"127.0.0.1","port":6379,"password":"thispassword"});
    // constructor() {}

    public async find():Promise<any> {
        console.log("hu")
        return "hi"
    }

    async addMembers(key: string,...members: Array<string>):Promise<any> {
        const addAsync=promisify(this.client.sadd).bind(this.client)
        return addAsync(key, ...members)
    }

    async setMember(key: string, member: string):Promise<any> {
        const setAsync=promisify(this.client.set).bind(this.client)
        return setAsync(key, member)
    }

    async getMember(key: string):Promise<any> {
        const getAsync=promisify(this.client.get).bind(this.client)
        return getAsync(key)
    }

    async delMember(key: string):Promise<any> {
        const delAsync=promisify(this.client.del).bind(this.client)
        return delAsync(key)
    }

    async removeMembers(key: string, ...members: Array<string>):Promise<any> {
        const removeAsync=promisify(this.client.srem).bind(this.client)
        return removeAsync(key,...members)
    }

    async randomMembers({ key, count }: { key: string; count: number; }): Promise<any> {
        const randomAsync=promisify(this.client.srandmember).bind(this.client)
        return randomAsync(key,count)
    }

    async popRandomMembers({ key, count}: {key: string; count: number; }): Promise<any> {
        const popAsync=promisify(this.client.spop).bind(this.client)
        return popAsync(key,count)
    }

    async sMembers(key: string): Promise<any> {
        const membersAsync=promisify(this.client.smembers).bind(this.client)
        return membersAsync(key)
    }

    async memberCount(key: string): Promise<any> {
        const membersAsync=promisify(this.client.scard).bind(this.client)
        return membersAsync(key)
    }

    async createEvent(eventKey: string, pendingKey: string, eventJSON: string) {
        this.setMember(eventKey,eventJSON)
        this.addMembers(pendingKey,eventKey)
    }

    async cancelEvent(eventKey: string, pendingKey: string, userId: string) {
        const eventJSON= await this.getMember(eventKey)
        if (eventJSON == false ) {
            throw new Error('not found !!')
        }
        const event= JSON.parse(eventJSON)
        if (event.userIds[0] != userId) {
            throw new Error('forbidden')
        }
        if( event.startedAt ) {
            throw new Error('Already started')
        }

        await this.removeMembers(pendingKey, eventKey)
        await this.delMember(eventKey)
    }

    async getPendingEventsFor(pendingKey: string, userId: string) :Promise<any>{
        const eventKeys= await this.sMembers(pendingKey)
        if(!eventKeys) {
            return []
        }
        const events=[]
        eventKeys.forEach(async key => {
            const eventJSON= await this.getMember(key)
            let hasJoined= false
            const event=JSON.parse(eventJSON)
            if(!eventJSON) {
                this.removeMembers(pendingKey, key)
            } else {
                let usersJoinedCount= 0
                event.userIds.forEach(user => {
                    usersJoinedCount=usersJoinedCount+1;
                    if(userId == user) {
                        hasJoined=true
                    }
                });
                let onWhiteList= false
                if(!hasJoined) {
                    for (const item of event.whiteList) {
                        if (item == userId) {
                            onWhiteList=true
                            break;
                        }
                    }
                }

                if( hasJoined || onWhiteList) {
                    events.push(event)
                }
            } 
        });
        return JSON.stringify(events)
    }

    async getActiveEventsFor(activeKey: string, userId: string) :Promise<any>{
        const eventKeys= await this.sMembers(activeKey )
        if(!eventKeys) {
            return []
        }
        const events=[]
        eventKeys.forEach(async key => {
            const eventJSON= await this.getMember(key)
            const event = JSON.parse(eventJSON)
            event.userIds.forEach(user => {
                if(userId == user) {
                    events.push(event)
                }
            });
        });
        return JSON.stringify(events)
    }

    async joinEvent(eventKey: string, pendingKey: string, activeKey: string, userId: string, userAlias: string, timestamp: number) {
        let eventJSON=await this.getMember(eventKey)
        if(!eventJSON) {
            this.removeMembers(pendingKey, eventKey)
            return 'Not Found'
        }
        const event=JSON.parse(eventJSON)
        if(event.startedAt) {
            return 'Already started'
        }
        let hasJoined= false
        let usersJoinedCount=0
        for (const id of event.userIds) {
            usersJoinedCount+=1
            if(id == userId) {
                hasJoined=true
            }
        }

        if(hasJoined) {
            return 'already joined'
        }
        let onWhiteList=false
        for (const item of event.whiteList) {
            if(item==userId) {
                onWhiteList=true
                break
            }
        }
        if(!onWhiteList) {
            return 'forbidden'
        }
        event.userIds.push(userId)
        event.aliases.push(userAlias)

        if(usersJoinedCount + 1==event.capacity) {
            this.removeMembers(pendingKey,eventKey)
            this.addMembers(activeKey,eventKey)
            event.startedAt=timestamp
        }
        eventJSON =JSON.stringify(event)
        this.setMember(eventKey,eventJSON)
        return eventJSON
        //
    }

    async autoJoinEvent(pendingKey: string,  activeKey: string, userId: string, userAlias: string, capacity:number, params: string, timestamp: number) {
        const eventKeys=await this.sMembers(pendingKey)
        if(!eventKeys) {
            return 'Not Found'
        }
        eventKeys.forEach(async eventKey => {
            let eventJSON=await this.getMember(eventKey)
            if(!eventJSON) {
                this.removeMembers(pendingKey,eventKey)
            } else {
                const event=JSON.parse(eventJSON)
                if(event.capacity == capacity && event.params == params) {
                    let hasJoined=false
                    let usersJoinedCount=0
                    for (const id of event.userIds) {
                        usersJoinedCount+=1
                        if(id == userId) {
                            hasJoined=true
                        }
                    }
                    if(!hasJoined) {
                        let canJoin=false
                        let whiteListCount=0
                        let onWhiteList=false
                        for (const item of event.whiteList) {
                            whiteListCount+=1
                            if(item==userId) {
                                onWhiteList=true
                                break
                            }
                        }
                        if(onWhiteList) {
                            canJoin=true
                        } else {
                            const onBlackList=false
                            for (const item of event.blackList) {
                                if(item==userId) {
                                    onWhiteList=true
                                    break
                                }
                            }
                            canJoin=!onBlackList
                        }
                        if(canJoin) {
                            event.userIds.push(userId)
                            event.aliases.push(userAlias)
                            if(usersJoinedCount + 1 ==event.capacity) {
                                this.removeMembers(pendingKey,eventKey)
                                this.addMembers(activeKey,eventKey)
                                event.startedAt=timestamp
                            }
                            eventJSON=JSON.stringify(event)
                            this.setMember(eventKey,eventJSON)
                            return eventJSON
                        }
                    }

                }
            }
        });
        // return nil
    }
}