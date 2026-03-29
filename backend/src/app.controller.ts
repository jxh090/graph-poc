import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':filename')
  getData(@Param('filename') filename: string): object {
    return this.appService.getData(filename);
  }
}
