// import { ConfigService } from '@nestjs/config';
// import { DataSourceOptions } from 'typeorm';

// export const typeOrmConfig = async (
//   config: ConfigService,
// ): Promise<DataSourceOptions> => ({
//   type: 'postgres',
//   host: config.get('DB_HOST'),
//   port: config.get<number>('DB_PORT'),
//   username: config.get('DB_USERNAME'),
//   password: config.get('DB_PASSWORD'),
//   database: config.get('DB_NAME'),
//   synchronize: false,
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/database/migrations/*.js'],
// });

import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
