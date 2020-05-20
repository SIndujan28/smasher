import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'
import { UserEntity } from 'src/entities/user.entity';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
            RedisModule,
            JwtModule.register({secret:process.env.SECRET,signOptions:{expiresIn:3600,}}),
            PassportModule.register({defaultStrategy:'jwt'})
          ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [PassportModule,JwtStrategy]
})
export class AuthModule {}
