import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CepDataResponseDto {
  @ApiProperty({
    example: '01001000 ou 01001-000',
    description: 'Cep a ser consultado. Aceita formato 00000-000 ou 00000000.',
  })
  @IsNotEmpty({ message: 'O campo "cep" é obrigatório' })
  @IsString({ message: 'O campo "cep" deve ser uma string.' })
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'Formato inválido inválido. Use 00000-000 ou 00000000.',
  })
  cep: string;
}
