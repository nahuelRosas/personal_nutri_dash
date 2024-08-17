import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ENVIRONMENT } from '@/common/base/enum/common.enum';
import * as dotenv from 'dotenv';

dotenv.config();

const baseOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
};

const automatedTests: DataSourceOptions = {
  type: 'better-sqlite3',
  database: `./data/tests.${Math.random()}.db`,
  synchronize: true,
  dropSchema: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const environmentConfig: Record<string, DataSourceOptions> = {
  [ENVIRONMENT.PRODUCTION]: { ...baseOptions, synchronize: false },
  [ENVIRONMENT.STAGING]: { ...baseOptions, synchronize: false },
  [ENVIRONMENT.DEVELOPMENT]: { ...baseOptions, synchronize: true },
  [ENVIRONMENT.AUTOMATED_TEST]: automatedTests,
};

export const datasourceOptions: DataSourceOptions =
  environmentConfig[process.env.NODE_ENV!] ??
  (() => {
    throw new Error('No environment defined');
  })();

export default new DataSource({
  ...datasourceOptions,
  entities: [
    join(__dirname, '../modules/**/infrastructure/persistence/*.schema.ts'),
  ],
  migrations: ['./data/migrations/*.ts'],
  driver: require('mysql2'),
});
