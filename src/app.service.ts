import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise'
import 'dotenv/config'
import { FoglalasDto } from './foglalasDto.dto.js';
import { Foglalas } from './foglalas.js';

const mysqlConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

@Injectable()
export class AppService {

  async addNewFoglalas(foglalas: FoglalasDto){
    const[rows] = await mysqlConnection.execute(
      "SELECT MAX(id) + 1 as newID from reservations"
    )

    const newId = (rows as any[])[0].newID ?? 1;

    const[result] = await mysqlConnection.execute(
      "INSERT INTO reservations (id, name, email, startDate, guests) VALUES(?, ?, ?, ?, ?)",
      [newId, foglalas.name, foglalas.email, foglalas.startDate, foglalas.guests]
    )
  }

  async darabSzam(){
    const[result] = await mysqlConnection.execute(
      "SELECT * from reservations"
    )
    const rows = result as Foglalas[]
    return rows.length
  }
}
