import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ViaCepService {
  private readonly logger = new Logger(ViaCepService.name);

  private validateCepFormat(cep: string): void {
    const isValid = /^\d{5}-\d{3}$/.test(cep) || /^\d{8}$/.test(cep);
    if (!isValid) {
      this.logger.warn(`CEP inválido inserido: ${cep}. Use o formato XXXXX-XXX ou XXXXXXXX.`);
      throw new Error('CEP inválido!');
    }
  }

  async rescueCepData(cep: string): Promise<any> {
    try {
      this.validateCepFormat(cep);

      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.data || response.data.erro) {
        this.logger.warn(`O Cep ${cep} não foi localizado.`);
        throw new Error('Cep não localizado!');
      }

      return response.data;
      
    } catch (error) {
      this.logger.error(`Erro ao consultar o Cep ${cep}: ${error.message}`);
      throw new Error('Erro ao localizar o Cep!');
    }
  }
}

