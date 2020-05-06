import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm'
import { RegisterDTO, LoginDTO } from 'src/models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepo:Repository<UserEntity>) {}
    private mockUser={
        "email": "jake@jake.jake",
        "token": "jwt.token.here",
        "username": "jake",
        "bio": "I work at statefarm",
        "image": null,
        "password":"123"
    }

    async register(credentials: RegisterDTO) {
        try {
            const user= this.userRepo.create(credentials)
            await user.save();
            if(credentials.email === this.mockUser.email) {
                return this.mockUser
            } 
        }catch(e) {
            return new InternalServerErrorException()
        }
    }

    async login({email,password}: LoginDTO) {
        try {
            if(email===this.mockUser.email && password===this.mockUser.password)
            return "logged In";
        }catch(e) {
            return new UnauthorizedException('Invalid credentials');
        }
    }
}
