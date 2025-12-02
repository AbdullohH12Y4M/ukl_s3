import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateMatakuliahDto {
  @ApiProperty({
    example: 'IF101',
    description: 'Kode matakuliah',
  })
  @IsString()
  @IsNotEmpty()
  kode: string;

  @ApiProperty({
    example: 'Pemrograman Web',
    description: 'Nama matakuliah',
  })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({
    example: 3,
    description: 'Jumlah SKS (1-6)',
  })
  @IsInt()
  @Min(1)
  @Max(6)
  sks: number;

  @ApiProperty({
    example: 3,
    description: 'Semester (1-8)',
  })
  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;
}

export class UpdateMatakuliahDto {
  @ApiProperty({
    example: 'IF101',
    description: 'Kode matakuliah',
    required: false,
  })
  @IsString()
  @IsOptional()
  kode?: string;

  @ApiProperty({
    example: 'Pemrograman Web',
    description: 'Nama matakuliah',
    required: false,
  })
  @IsString()
  @IsOptional()
  nama?: string;

  @ApiProperty({
    example: 3,
    description: 'Jumlah SKS (1-6)',
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(6)
  @IsOptional()
  sks?: number;

  @ApiProperty({
    example: 3,
    description: 'Semester (1-8)',
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(8)
  @IsOptional()
  semester?: number;
}