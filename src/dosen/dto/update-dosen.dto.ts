import { PartialType } from '@nestjs/swagger';
import { CreateDosenDto } from './create-dosen.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateDosenDto {
  @ApiProperty({
    example: 'Dr. Budi Santoso, M.Kom',
    description: 'Nama lengkap dosen',
    required: false,
  })
  @IsString()
  @IsOptional()
  nama?: string;

  @ApiProperty({
    example: 'budi.santoso@univ.ac.id',
    description: 'Email dosen',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '081234567890',
    description: 'Nomor telepon dosen',
    required: false,
  })
  @IsString()
  @IsOptional()
  telepon?: string;
}