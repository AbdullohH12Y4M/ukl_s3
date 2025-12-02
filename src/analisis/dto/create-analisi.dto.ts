import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Semester } from '@prisma/client';
import { Type } from 'class-transformer';

export class TopMatakuliahDosenDto {
  @ApiProperty({
    example: '2024/2025',
    description: 'Tahun ajaran (opsional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  tahun_ajaran?: string;

  @ApiProperty({
    example: 'GANJIL',
    enum: Semester,
    description: 'Semester (opsional)',
    required: false,
  })
  @IsEnum(Semester)
  @IsOptional()
  semester?: Semester;

  @ApiProperty({
    example: 10,
    description: 'Jumlah data yang ditampilkan (default: 10)',
    required: false,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}