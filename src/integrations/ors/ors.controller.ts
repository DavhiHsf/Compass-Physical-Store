import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { OrsService } from './ors.service';
import { DistanceResponseDto } from './distance-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('OpenRouteService')
@Controller('calculateDistance')
export class OrsController {
  constructor(private readonly orsService: OrsService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Calcula a distância entre dois pontos usando a API OpenRouteService' })
  @ApiResponse({
    status: 200,
    description: 'Distâncias calculadas com sucesso',
  })
  async calculateDistance(@Body() body: DistanceResponseDto) {
    const result = await this.orsService.calculateDistance(body.from, body.to);
    return {
      'origem': body.from,
      'destino(s)': body.to,
      distancias: result.distances.map(d => `${(d / 1000).toFixed(2)} km`),
    };
  }
}