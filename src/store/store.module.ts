import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreRepository } from './store.repository';
import { ViaCepModule } from 'src/integrations/viacep/viacep.module';
import { MapboxModule } from 'src/integrations/mapbox/mapbox.module';
import { OrsModule } from 'src/integrations/ors/ors.module';
import { MelhorEnvioModule } from 'src/integrations/melhor-envio/melhor-envio.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    ViaCepModule,
    MapboxModule,
    OrsModule,
    MelhorEnvioModule
  ],
  controllers: [StoreController],
  providers: [
    StoreService,
    StoreRepository,
  ],
  exports: [StoreService],
})
export class StoreModule {}
