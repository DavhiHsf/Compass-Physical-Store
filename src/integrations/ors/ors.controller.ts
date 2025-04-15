import { Controller, Get, Query } from '@nestjs/common';
import { OrsIntegration } from './ors.service';

@Controller('ors')
export class OrsController {
  constructor(private readonly orsIntegration: OrsIntegration) {}

  @Get('test-route')
  async testRoute(
    @Query('startLat') startLat: number,
    @Query('startLon') startLon: number,
    @Query('endLat') endLat: number,
    @Query('endLon') endLon: number,
  ) {
    const distance = await this.orsIntegration.rescueRouteDistance(
      { lat: startLat, lon: startLon },
      { lat: endLat, lon: endLon },
    );

    return {
      distanceInKm: (distance.distance / 1000).toFixed(2) + ' km',
    };
  }
}
