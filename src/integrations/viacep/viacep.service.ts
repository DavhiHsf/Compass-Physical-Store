import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ViaCepService {
  private readonly logger = new Logger(ViaCepService.name);

  private validateCepFormat(cep: string): void {
    const cepValid = /^\d{5}-\d{3}$/.test(cep) || /^\d{8}$/.test(cep);
    if (!cepValid) {
      this.logger.warn(`Cep inválido: ${cep}. O formato correto é 00000-000 ou 00000000.`);
        throw new BadRequestException("Cep inválido!");
    }
    this.logger.log(`Formato do CEP ${cep} validado com sucesso.`);

  }

  async rescueCepData(cep: string): Promise<any> {
    try {
      this.validateCepFormat(cep);

      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.data || response.data.erro) {
        this.logger.warn(`O Cep ${cep} não foi localizado.`);
        throw new NotFoundException('Cep não localizado!');
      }

      this.logger.log(`Buscando dados para o Cep: ${cep}`);

      this.logger.log(`Dados do Cep ${cep} localizados com sucesso.`);

      return response.data;
      
    } catch (error) {
      this.logger.error(`Erro ao consultar o Cep ${cep}: ${error.message}`);

      if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
      }

      throw new Error('Erro interno ao buscar o CEP.');
    }
  }
}

