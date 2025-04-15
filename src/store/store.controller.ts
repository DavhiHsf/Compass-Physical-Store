import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
// import { CreateStoreDto } from './dto/create-store.dto';
// import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('allStores')
  async findAll(): Promise<Store[]> {

    console.log('Todas as lojas retornadas com sucesso!');
    return this.storeService.rescueAllStores();
  }

  @Get('storeById/:id')
  async findOne(@Param('id') id: string): Promise<Store> {
    const store = await this.storeService.rescueStoresById(+id);
    if (!store) {
      throw new NotFoundException(`A loja com o id ${id} não foi encontrada.`);
    }
    console.log(`A loja ${store.storeName} (StoreID ${id}) foi retornada com sucesso.`);
    return store;
  }
}
