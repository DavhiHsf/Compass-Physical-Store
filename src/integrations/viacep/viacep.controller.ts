import { Controller, Get, Param } from '@nestjs/common';
import { ViaCepService } from './viacep.service';

@Controller('checkCep')
export class ViaCepController {
  constructor(private readonly viaCepService: ViaCepService) {}

  @Get(':cep')
  async getCepInfo(@Param('cep') cep: string) {
    const data = await this.viaCepService.rescueCepData(cep);
        return {
        'Dados do Cep informado': {
            cidade: data.localidade,
            rua: data.logradouro,
            complemento: data.complemento,
            bairro: data.bairro,
            estado: data.estado,
            cep: data.cep,
            }
        }
    }
};
