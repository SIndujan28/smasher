import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from 'src/models/user.dto';

@Controller('users')
export class AuthController {
    constructor(private authService:AuthService) {}
    @Post()
    register(@Body() credentials: RegisterDTO) {
        return this.authService.register(credentials)
    }

    @Post('/login')
    login(@Body() credentials: LoginDTO) {
        return this.authService.login(credentials)
    }

    @Get('/hi')
    hi() {
        return 'heellosss'
    }
}
