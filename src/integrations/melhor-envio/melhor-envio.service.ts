import { BadRequestException, InternalServerErrorException, Injectable, Logger} from '@nestjs/common'; 
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MelhorEnvioService {
  private readonly logger = new Logger(MelhorEnvioService.name);

  private readonly url = 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate';

  private readonly tokenMelhorEnvio = process.env.TOKEN_MELHOR_ENVIO;

  private readonly defaultProduct = [
    {
      id: 'standardized',
      width: 15,       
      height: 10,      
      length: 20,      
      weight: 0.8,
      insurance_value: 0,
      quantity: 1
    }
  ];

  constructor(private readonly http: HttpService) {}

  async calculateFreight(fromCep: string, toCep: string, products = this.defaultProduct) {

    const body = {

      from: { postal_code: fromCep },
      to: { postal_code: toCep },
      products,
      options: {
          receipt: false,
          own_hand: false,
          insurance_value: 0,
          reverse: false,
          non_commercial: true
      },
      validate: true
    };

    const headers = {
      Authorization: `Bearer ${this.tokenMelhorEnvio}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
    this.logger.log(`Calculando frete de ${fromCep} para ${toCep}...`);

    const response = await firstValueFrom(
      this.http.post(this.url, body, { headers })
    );

    if (!response.data || !Array.isArray(response.data)) {
      this.logger.error(`Resposta inválida da API do Melhor Envio. Dados recebidos: ${JSON.stringify(response.data)}`);
      throw new BadRequestException('Resposta inválida da API do Melhor Envio.');
    }

    const filteredResponse = response.data.filter((service) =>
      ['PAC', 'SEDEX'].includes(service.name.toUpperCase())
    );

    this.logger.log(`Frete calculado com sucesso de ${fromCep} para ${toCep}. Fretes encontrados: ${filteredResponse.length}`);

    return filteredResponse

  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error.message || 'Erro desconhecido.';
    this.logger.error(
      `Erro ao calcular frete entre ${fromCep} e ${toCep}: ${errorMessage}`,
      error.stack,
    );

    if (error?.response?.status === 400) {
      throw new BadRequestException('Requisição inválida à API do Melhor Envio.');
    }

    throw new InternalServerErrorException('Erro ao calcular frete com a API do Melhor Envio.');
  }
  
  }
};
