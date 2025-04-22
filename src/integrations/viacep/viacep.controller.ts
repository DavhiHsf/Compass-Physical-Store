import { Controller, Get, Query } from '@nestjs/common';
import { ViaCepService } from './viacep.service';
import { CepDataResponseDto } from './cep-data-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { sanitizeCep } from 'src/utils/sanitizeCep';

@ApiTags('ViaCEP')
@Controller('viacep')
export class ViaCepController {
  constructor(private readonly viaCepService: ViaCepService) {}

  @Get('checkCep')
  @ApiOperation({ summary: 'Busca dados de um Cep usando a API ViaCEP' })
  @ApiQuery({ 
    name: 'cep', 
    type: String, 
    required: true, 
    description: 'Cep a ser consultado. Formatos aceitos: 00000-000 ou 00000000.' 
  })
  @ApiResponse({ 
    status: 200, description: 'Dados do Cep retornados com sucesso.',
    example: {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      unidade: '',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      estado: 'São Paulo',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107'
    }
  })

  @ApiResponse({ status: 400, description: 'Erro na requisição ou Cep inválido.' })
  @ApiResponse({ status: 404, description: 'Cep não encontrado na base do ViaCEP.' })
  @ApiResponse({ status: 500, description: 'Erro interno ao processar a requisição.' })

  async consultarCep(@Query() query: CepDataResponseDto) {
    const cleanCep = sanitizeCep(query.cep);
    return this.viaCepService.rescueCepData(cleanCep);
  }
}
