import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database-connection.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
  //   TypeOrmModule.forRootAsync({
  //   useClass: DatabaseConnectionService
  // }),AuthModule,
   EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
