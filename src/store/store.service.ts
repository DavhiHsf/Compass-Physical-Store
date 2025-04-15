import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>){}

  rescueAllStores(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  async rescueStoresById(id: number): Promise<Store | null> {
    return this.storeRepository.findOne({ where : { storeID: id } });
  }
};
