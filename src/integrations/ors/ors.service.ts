import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable()
export class OrsService {
  private readonly logger = new Logger(OrsService.name);

  private readonly apiKey = process.env.ORS_API_KEY;

  private readonly orsUrl = 'https://api.openrouteservice.org/v2/matrix/driving-car';

  async calculateDistance(
    origin: Coordinates,
    destinations: Coordinates[],
  ): Promise<{ distances: number[]; }> {
    try {
      this.logger.log('Calculando distância com os seguintes parâmetros:');
      
      this.logger.log(`Origem: ${JSON.stringify(origin)}`);

      this.logger.log(`Destinos: ${JSON.stringify(destinations)}`);

      if (!Array.isArray(destinations)) {
        this.logger.warn('Destino enviado como objeto único. Convertendo para array...');
        destinations = [destinations];
      }

      const allLocations = [
        [origin.longitude, origin.latitude],
        ...destinations.map(dest => [dest.longitude, dest.latitude]),
      ];

      const response: AxiosResponse = await axios.post(
        this.orsUrl,
        {
          locations: allLocations,
          sources: [0],
          destinations: destinations.map((_, index) => index + 1),
          metrics: ['distance'],
          units: 'm',
        },
        {
          headers: {
            Authorization: this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data || !response.data.distances || !Array.isArray(response.data.distances[0])) {
        this.logger.error('Resposta da ORS mal formatada:', response.data);
        throw new Error('Resposta da ORS mal formatada!');
      }

      const distances = response.data.distances?.[0] || [];

      this.logger.log(`Distâncias calculadas: ${JSON.stringify(distances)}`);


      return {
        distances
      };

    } catch (error: any) {
      this.logger.error('Erro ao chamar ORS:', error.response?.data || error.message);
      throw new Error('Erro ao calcular distâncias entre os pontos!');
    }
  }
}
