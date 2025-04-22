import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MelhorEnvioController } from './melhor-envio.controller';
import { MelhorEnvioService } from './melhor-envio.service';

@Module({
  imports: [HttpModule],
  controllers: [MelhorEnvioController],
  providers: [MelhorEnvioService],
  exports: [MelhorEnvioService],
})
export class MelhorEnvioModule {}
