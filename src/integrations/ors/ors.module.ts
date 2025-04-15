import { Module } from '@nestjs/common';
import { OrsIntegration } from './ors.service';
import { OrsController } from './ors.controller';

@Module({
  controllers: [OrsController],
  providers: [OrsIntegration],
  exports: [OrsIntegration],
})
export class OrsModule {}
