import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

    private mockUser={
        "email": "jake@jake.jake",
        "token": "jwt.token.here",
        "username": "jake",
        "bio": "I work at statefarm",
        "image": null,
        "password":"123"
    }

    async register(data:any) {
        try {
            if(data.email === this.mockUser.email) {
                return this.mockUser
            } 
        }catch(e) {
            return new InternalServerErrorException()
        }
    }

    async login({email,password}: any) {
        try {
            if(email===this.mockUser.email && password===this.mockUser.password)
            return true;
        }catch(e) {
            return new UnauthorizedException('Invalid credentials');
        }
    }
}
