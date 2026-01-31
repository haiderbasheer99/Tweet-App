import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   url: process.env.DATABASE_URL,
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/database/migrations/*.js'],
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   synchronize: false,
// });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});
