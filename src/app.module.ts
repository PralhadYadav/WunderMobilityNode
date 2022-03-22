import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


/**
* @description AppModule is first module which get loaded when application start.
*/
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
