import { Injectable } from '@nestjs/common';
import {createClient} from 'redis'
import { promisify } from 'util';

@Injectable()
export class RedisService {

    private readonly client=createClient({"host":"127.0.0.1","port":6379,"password":"thispassword"});
    constructor() {}

    public async find():Promise<any> {
        console.log("hu")
        return "hi"
    }

    async addMember(key: string,...members: Array<string>):Promise<any> {
        const addAsync=promisify(this.client.sadd).bind(this.client)
        console.log(typeof(addAsync))
        return addAsync(key, ...members)
    }

    async removeMember(key: string, ...members: Array<string>):Promise<any> {
        const removeAsync=promisify(this.client.srem).bind(this.client)
        return removeAsync(key,...members)
    }

    async randomMember({ key, count }: { key: string; count: number; }): Promise<any> {
        const randomAsync=promisify(this.client.srandmember).bind(this.client)
        return randomAsync(key,count)
    }

    async popRandomMember({ key, count}: {key: string; count: number; }): Promise<any> {
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

}
