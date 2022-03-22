import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { smapleData } from './common/constants/smaple_response';

/**
* @description AppController is first controller get loaded with api end point.
*/
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  /**
* @description getHello is default route which return static string response.
*/
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
* @description getCartValue is final cartValue router which will return response after applying promo codes.
*/
  @Post('getCartValue')
  getCartValue(@Body() data: Object): Object {
    return this.appService.getCartPrice(data)
  }
}
