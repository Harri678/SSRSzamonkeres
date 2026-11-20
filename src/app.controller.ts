import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { FoglalasDto } from './foglalasDto.dto.js';
import { error } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getHello() {
    return {
      adatok: {},
      errors: [],
      szam: await this.appService.darabSzam(),
      success: null
    }
  }

  @Post()
  @Render('index')
  async addNewSzallas(@Body() body: FoglalasDto){
    var errors: string[] = []

    if(!body.name){
      errors.push("Nincs nev megadva")
    }

    const emailRegx = /^[a-z]{1,}@[a-z]{1,}/
    if(!emailRegx.test(body.email)){
      errors.push("Nem megfelelo email formatum")
    }

    const jelenlegiIdo = new Date(Date.now())
    const dateFormat = new Date(body.startDate)


    if(dateFormat < jelenlegiIdo){
      errors.push("A datum nem lehet a multban")
    }

    if(!body.guests || body.guests < 1 || body.guests > 10){
      errors.push("Nem megfelelo vendeg megadas.")
    }

    if(errors.length > 0){
      return{
        adatok: body,
        errors: errors,
        szam: await this.appService.darabSzam(),
        success: false
      }
    }else{
      this.appService.addNewFoglalas(body)
      return{
        adatok: {},
        errors: ["Sikeres foglalas"],
        szam: await this.appService.darabSzam(),
        success: true
      }
    }
  }
}
