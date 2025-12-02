import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Hari, Semester } from '@prisma/client';

export class CreatePenjadwalanDto {
  @ApiProperty({ example: 'uuid-matakuliah-id' })
  @IsString()
  @IsNotEmpty()
  id_matakuliah: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  nidn_dosen: string;

  @ApiProperty({ example: 'R301' })
  @IsString()
  @IsNotEmpty()
  ruangan: string;

  @ApiProperty({ example: 'SENIN', enum: Hari })
  @IsEnum(Hari)
  hari: Hari;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Format jam harus HH:MM (contoh: 08:00)',
  })
  jam_mulai: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Format jam harus HH:MM (contoh: 10:30)',
  })
  jam_selesai: string;

  @ApiProperty({ example: '2024/2025' })
  @IsString()
  @IsNotEmpty()
  tahun_ajaran: string;

  @ApiProperty({ example: 'GANJIL', enum: Semester })
  @IsEnum(Semester)
  semester: Semester;
}

export class UpdatePenjadwalanDto {
  @ApiProperty({ example: 'uuid-matakuliah-id', required: false })
  @IsString()
  id_matakuliah?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsString()
  nidn_dosen?: string;

  @ApiProperty({ example: 'R301', required: false })
  @IsString()
  ruangan?: string;

  @ApiProperty({ example: 'SENIN', enum: Hari, required: false })
  @IsEnum(Hari)
  hari?: Hari;

  @ApiProperty({ example: '08:00', required: false })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  jam_mulai?: string;

  @ApiProperty({ example: '10:30', required: false })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  jam_selesai?: string;

  @ApiProperty({ example: '2024/2025', required: false })
  @IsString()
  tahun_ajaran?: string;

  @ApiProperty({ example: 'GANJIL', enum: Semester, required: false })
  @IsEnum(Semester)
  semester?: Semester;
}

export class PilihMatakuliahDto {
  @ApiProperty({
    example: ['uuid-penjadwalan-1', 'uuid-penjadwalan-2'],
    description: 'Array ID penjadwalan yang dipilih',
  })
  @IsString({ each: true })
  @IsNotEmpty()
  id_penjadwalan: string[];
}