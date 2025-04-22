import { Module } from '@nestjs/common';
import { MapboxController } from './mapbox.controller';
import { MapboxService } from './mapbox.service';
import { ViaCepModule } from '../viacep/viacep.module';

@Module({
  imports: [ViaCepModule],
  controllers: [MapboxController],
  providers: [MapboxService],
  exports: [MapboxService],
})
export class MapboxModule {}
