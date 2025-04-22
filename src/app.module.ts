import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './database/db-config';
import { StoreModule } from './store/store.module';
import { MapboxModule } from './integrations/mapbox/mapbox.module';
import { ViaCepModule } from './integrations/viacep/viacep.module';
import { MelhorEnvioModule } from './integrations/melhor-envio/melhor-envio.module';
import { OrsModule } from './integrations/ors/ors.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    StoreModule,
    MapboxModule,
    ViaCepModule,
    MelhorEnvioModule,
    OrsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
