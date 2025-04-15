import { Module } from '@nestjs/common';
import { ViaCepService } from './viacep.service';
import { ViaCepController } from './viacep.controller';

@Module({
  controllers: [ViaCepController],
  providers: [ViaCepService],
  exports: [ViaCepService],
})
export class ViaCepModule {}
