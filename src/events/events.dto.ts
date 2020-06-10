import {} from 'class-validator'
export class CreateGameDto {
    userId: string;
    userAlias: string;
    capacity: number;
    whiteList: Array<string>;
    blackList: Array<string>;
    perUserTimeoutSec: number;
    params: string;
}

export class AutoJoinGameDto {
    userId: string;
    userAlias: string;
    capacity: number;
    params: string;
}

export class JoinByIdDto {
    userId: string;
    userAlias: string;
    eventId: string;
}

export class CancelGameDto {
    userId: string;
    eventId: string;
}

export class GameDataDto {
    roomId: string;
    gameData: string;
}