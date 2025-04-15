import { DataSourceOptions } from 'typeorm';
import { Store } from '../store/entities/store.entity';

export const dbConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'src/database/dbStores.sqlite',
  synchronize: true,
  logging: true,
  entities: [Store],
};