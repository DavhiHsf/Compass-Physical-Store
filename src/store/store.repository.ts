import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly repository: Repository<Store>,
  ) {}

  async rescueAll(): Promise<Store[]> {
    return this.repository.find();
  }

  async rescueById(id: number): Promise<Store | null> {
    return this.repository.findOne({ where: { ID: id } });
  }
}

