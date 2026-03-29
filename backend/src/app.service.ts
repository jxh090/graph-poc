/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getData(filename: string): object {
    const filePath = path.join(__dirname, '../output/json', filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
}
