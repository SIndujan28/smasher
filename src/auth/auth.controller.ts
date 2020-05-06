import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
    constructor(private authService:AuthService) {}
    @Post()
    register() {
        return this.authService.register({"email":"dasd","password":"123"})
    }

    @Post()
    login() {return}
}
