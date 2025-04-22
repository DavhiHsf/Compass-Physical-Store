import { Injectable, Logger } from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { Store } from './entities/store.entity';
import { ViaCepService } from '../integrations/viacep/viacep.service';
import { MapboxService } from '../integrations/mapbox/mapbox.service';
import { OrsService } from '../integrations/ors/ors.service';
import { MelhorEnvioService } from '../integrations/melhor-envio/melhor-envio.service';

interface StoreDistanceResult {
  name: string;
  city: string;
  postalCode: string;
  type: string;
  distance: string;
  value: {
    deliveryTime: string;
    price: string;
    description: string;
  }[];
  pins: {
    latitude: number;
    longitude: number;
  }
}

function autoDeliveryTime(distanceInKm: number): string {
  if (distanceInKm <= 5) return 'Entrega em até 1 dia útil';
  if (distanceInKm <= 15) return 'Entrega rápida (até 2 dias úteis)';
  if (distanceInKm <= 30) return 'Entrega padrão (até 3 dias úteis)';
  return 'Entrega  em até 5 dias úteis';
}

@Injectable()
export class StoreService {

  private readonly logger = new Logger(StoreService.name);

  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly viacepService: ViaCepService,
    private readonly mapboxService: MapboxService,
    private readonly orsService: OrsService,
    private readonly melhorEnvioService: MelhorEnvioService,
  ) {}

  rescueAllStores(): Promise<Store[]> {
    this.logger.log('Iniciando busca por todas as lojas.');
    return this.storeRepository.rescueAll();
  }

  rescueStoresById(id: number): Promise<Store | null> {
    this.logger.log(`Iniciando busca pela loja com ID: ${id}`);
    return this.storeRepository.rescueById(id);
  }

  async rescueStoresByCep(cep: string): Promise<any> {
    this.logger.log(`Iniciando busca por lojas com base no CEP: ${cep}`);

    const cepData = await this.viacepService.rescueCepData(cep);

    if (!cepData || cepData.erro) {
      this.logger.warn(`CEP inválido ou não encontrado: ${cep}`);
      throw new Error(`Não foi possível encontrar dados para o CEP ${cep}.`);
    }

    this.logger.log(`Dados do CEP ${cep} encontrados: ${JSON.stringify(cepData)}`);

    const userCoordinates = await this.mapboxService.rescueCoordinatesByCepUser(cep);
    this.logger.log(`Coordenadas do usuário: ${JSON.stringify(userCoordinates)}`);

    const stores = await this.storeRepository.rescueAll();
    this.logger.log(`Total de lojas encontradas no banco de dados: ${stores.length}`);

    const storeCoordinates = stores.map((store) => ({
      latitude: store.latitude,
      longitude: store.longitude,
    }));

    const distanceData = await this.orsService.calculateDistance(userCoordinates, storeCoordinates);
    this.logger.log(`Distâncias calculadas entre o usuário e cada loja.`);

    const storesWithDistance = stores.map((store, index) => {
      const distanceInMeters = distanceData.distances[index];
      const distanceKm = distanceInMeters / 1000;

      return {
        ...store,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
      };
    });

    storesWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    const storesWithin50km = storesWithDistance.filter(store => store.distanceKm <= 50);

    let selectedStore: StoreDistanceResult;

    if (storesWithin50km.length > 0) {
      const nearestStore = storesWithin50km[0];
      this.logger.log(`Loja física encontrada a ${nearestStore.distanceKm} km: ${nearestStore.name}`);

      selectedStore = {
        name: nearestStore.name,
        city: nearestStore.city,
        postalCode: nearestStore.postalCode,
        type: 'PDV',
        distance: `${nearestStore.distanceKm} km de distância`,
        value: [
          {
            deliveryTime: autoDeliveryTime(nearestStore.distanceKm),
            price: 'R$ 15,00',
            description: 'Motoboy',
          },
        ],
        pins: {
          latitude: nearestStore.latitude,
          longitude: nearestStore.longitude,
        },
      };
    } else {
      const fallbackStore = storesWithDistance[0];
      this.logger.warn(`Nenhuma loja física dentro de 50km. Consultando lojas virtuais (${fallbackStore.name})`);

      const freightData = await this.melhorEnvioService.calculateFreight(cep, fallbackStore.postalCode);
      this.logger.log(`Frete calculado com sucesso de ${cep} para ${fallbackStore.postalCode}. Fretes encontrados: ${freightData.length}`);


      const freightOptions = freightData.map((item: any) => ({
        deliveryTime: `Entrega em até ${item.delivery_time} dias úteis`,
        codProductAgency: item.company?.id,
        price: `R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`,
        description: item.name,
      }));

      selectedStore = {
        name: fallbackStore.name,
        city: fallbackStore.city,
        postalCode: fallbackStore.postalCode,
        type: 'Loja Virtual',
        distance: `${fallbackStore.distanceKm} km de distância`,
        value: freightOptions,
        pins: {
          latitude: fallbackStore.latitude,
          longitude: fallbackStore.longitude,
        },

      };
    }

    this.logger.log(`Resultado final preparado para o CEP ${cep}.`);

    return {
      userPlace: {
        postalCode: cepData.cep,
        city: cepData.localidade || 'Não localizada',
        street: cepData.logradouro || 'Não localizada',
        complement: cepData.complemento || 'Não localizado',
        district: cepData.bairro || 'Não localizado',
        state: cepData.uf || 'Não localizado',
      },
      stores: [selectedStore]
    };
  }
}
