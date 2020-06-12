import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator'
export class CreateGameDto {
    @IsString()
    userId: string;

    @IsString()
    userAlias: string;

    @IsNumber()
    @IsOptional()
    capacity: number;

    @IsArray()
    @IsOptional()
    whiteList: Array<string>;

    @IsArray()
    @IsOptional()
    blackList: Array<string>;

    @IsNumber()
    @IsOptional()
    perUserTimeoutSec: number;

    @IsString()
    @IsOptional()
    params: string;
}

export class AutoJoinGameDto {
    @IsString()
    userId: string;

    @IsString()
    userAlias: string;

    @IsNumber()
    @IsOptional()
    capacity: number;

    @IsString()
    @IsOptional()
    params: string;
}

export class JoinByIdDto {
    @IsString()
    userId: string;

    @IsString()
    userAlias: string;

    @IsString()
    eventId: string;
}

export class CancelGameDto {
    @IsString()
    userId: string;

    @IsString()
    eventId: string;
}

export class GameDataDto {
    @IsString()
    roomId: string;

    @IsString()
    gameData: string;
}