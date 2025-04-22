import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { MelhorEnvioService } from './melhor-envio.service';
import { FreightResponseDto } from './freigth-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { sanitizeCep } from 'src/utils/sanitizeCep';


@ApiTags('Melhor Envio')
@Controller('melhorenvio')
export class MelhorEnvioController {
  constructor(private readonly melhorEnvioService: MelhorEnvioService) {}

  @Post('checkFreight')
  @HttpCode(200)
  @ApiOperation({ summary: 'Testa cotação de frete com Melhor Envio' })

  @ApiResponse({ 
    status: 200, description: 'Frete calculado com sucesso.',
    example: [
      {
        "id": 1,
        "name": "PAC",
        "price": "25.41",
        "custom_price": "25.41",
        "discount": "0.00",
        "currency": "R$",
        "delivery_time": 7,
        "delivery_range": {
            "min": 6,
            "max": 7
        },
        "custom_delivery_time": 7,
        "custom_delivery_range": {
            "min": 6,
            "max": 7
        },
        "packages": [
            {
                "price": "25.41",
                "discount": "0.00",
                "format": "box",
                "dimensions": {
                    "height": 10,
                    "width": 15,
                    "length": 20
                },
                "weight": "0.80",
                "insurance_value": "0.00",
                "products": [
                    {
                        "id": "standardized",
                        "quantity": 1
                    }
                ]
            }
        ],
        "additional_services": {
            "receipt": false,
            "own_hand": false,
            "collect": false
        },
        "company": {
            "id": 1,
            "name": "Correios",
            "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
        }
      }
    ]
})

  @ApiResponse({ status: 400, description: 'Erro na requisição.' })

  async testarCotacao(@Body() body: FreightResponseDto) {
    const fromCep = sanitizeCep(body.fromCep);
    const toCep = sanitizeCep(body.toCep);
    return this.melhorEnvioService.calculateFreight(fromCep, toCep);
  }
}

