import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPostalCode, IsString } from 'class-validator';

export class FreightResponseDto {
  @ApiProperty({
    example: '01001000',
    description: 'CEP de origem (formato brasileiro)',
  })
  @IsNotEmpty({ message: 'O campo fromCep não pode estar vazio.' })
  @IsString({ message: 'O campo fromCep deve ser uma string.' })
  @IsPostalCode('BR', { message: 'O fromCep deve ser um CEP válido do Brasil.' })
  fromCep: string;

  @ApiProperty({
    example: '20040030',
    description: 'CEP de destino (formato brasileiro)',
  })
  @IsNotEmpty({ message: 'O campo toCep não pode estar vazio.' })
  @IsString({ message: 'O campo toCep deve ser uma string.' })
  @IsPostalCode('BR', { message: 'O toCep deve ser um CEP válido do Brasil.' })
  toCep: string;
}
