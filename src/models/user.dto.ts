import { IsEmail, MinLength, IsString, MaxLength, IsOptional } from 'class-validator'

export class LoginDTO {
    @IsEmail()
    @IsString()
    @MinLength(6)
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDTO extends LoginDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
}

export class UpdateUserDTO {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    image: string;

    @IsOptional()
    bio: string;
}