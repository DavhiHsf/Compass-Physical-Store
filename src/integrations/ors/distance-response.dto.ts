import { ApiProperty } from '@nestjs/swagger';
import { Coordinates } from './ors.service';

export class DistanceResponseDto {
    @ApiProperty({
        type: Object,
        example: {
          latitude: -23.5505,
          longitude: -46.6333,
        },
      })
      from: Coordinates;
    
      @ApiProperty({
        type: [Object],
        example: [
          { latitude: -23.5511, longitude: -46.6344 },
          { latitude: -23.5522, longitude: -46.6355 },
        ],
      })
      to: Coordinates[];
    }
