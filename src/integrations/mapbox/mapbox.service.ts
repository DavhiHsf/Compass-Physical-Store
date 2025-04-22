import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ViaCepService } from '../viacep/viacep.service';

export interface CoordinatesResponse {
  latitude: number;
  longitude: number;
}

@Injectable()
export class MapboxService {
  private readonly logger = new Logger(MapboxService.name);

  private readonly mapboxApiKey = process.env.MAPBOX_API_KEY;

  constructor(private readonly viaCepService: ViaCepService) {}

  async rescueCoordinatesByCepUser(cep: string): Promise<CoordinatesResponse> {
    this.logger.log(`Buscando coordenadas para o CEP: ${cep}`);

    const addressData = await this.viaCepService.rescueCepData(cep);

    const { localidade, logradouro, bairro, uf } = addressData;

    const fullAddress = `${logradouro}, ${bairro}, ${localidade}, ${uf}, Brazil`;

    this.logger.log(`Endereço completo: ${fullAddress}`);

    const encodedAddress = encodeURIComponent(fullAddress);

    try {

      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`,
        {
          params: {
            access_token: this.mapboxApiKey,
            language: 'pt',
            limit: 1,
          },
      });

    const features = response.data.features;

      if (!features || features.length === 0) {
        this.logger.warn(`Coordenadas não localizadas para o endereço: ${fullAddress}`);
        throw new BadRequestException('Coordenadas não localizadas!');
      }

      const [longitude, latitude] = features[0].geometry.coordinates;

      this.logger.log(`Coordenadas encontradas: Latitude: ${latitude}, Longitude: ${longitude}`);

      return {
        latitude,
        longitude,
      };
      
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        this.logger.error(`Erro ao obter coordenadas para o CEP ${cep}: ${error.message}`);
        throw error;
      }

      this.logger.error(`Erro desconhecido ao consultar coordenadas para o CEP ${cep}: ${error.message}`);
      throw new InternalServerErrorException('Erro ao obter coordenadas com o Mapbox.');
    }
  }
}
