import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MapboxService, CoordinatesResponse } from './mapbox.service';
import { CoordinatesDto } from './coordinates-response.dto';
import { sanitizeCep } from 'src/utils/sanitizeCep';

@ApiTags('Mapbox')
@Controller('mapbox')
export class MapboxController {
  constructor(private readonly mapboxService: MapboxService) {}

  @Get('checkCoords')
  @ApiOperation({ summary: 'Busca coordenadas geográficas por Cep' })

  @ApiQuery({
    name: 'cep',
    type: String,
    required: true,
    example: '01001000 ou 01001-000',
    description: 'CEP válido para buscar as coordenadas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Coordenadas encontradas com sucesso.',
    example: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
    type: CoordinatesDto,
  })

  async getCoordinatesByCep(
    @Query('cep') cep: string,
  ): Promise<CoordinatesResponse> {
    const cleanCep = sanitizeCep(cep);
    return this.mapboxService.rescueCoordinatesByCepUser(cleanCep);
  }
}
