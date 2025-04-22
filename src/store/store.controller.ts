import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { ApiOperation, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('allStores')
  @ApiOperation({ summary: 'Lista todas as lojas' })
  @ApiResponse({ status: 200, description: 'Lista de todas as lojas', type: [Store] })

  async rescueAllStores(): Promise<Store[]> {
    return this.storeService.rescueAllStores();
  }

  @Get('storeById/:id')
  @ApiOperation({ summary: 'Busca loja por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Loja encontrada', type: Store })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })

  async rescueStoresById(@Param('id') id: string): Promise<Store> {

    const store = await this.storeService.rescueStoresById(+id);

    if (!store) {
      throw new NotFoundException(`A loja com o id ${id} não foi encontrada.`);
    }
    
    return store;
  }

  @Get('by-cep/:cep')
  @ApiOperation({ summary: 'Buscar loja mais próxima com base no CEP do cliente' })
  @ApiParam({ 
    name: 'cep', 
    type: String, 
    example: '01001000 ou 01001-000' 
  })
  @ApiResponse({ status: 200, description: 'Loja mais próxima ou loja online com frete' })

  rescueStoresByCep(@Param('cep') cep: string) {
    return this.storeService.rescueStoresByCep(cep);
  }
}
