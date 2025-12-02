import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateMahasiswaDto {
  @ApiProperty({ example: '2021001', description: 'NIM Mahasiswa' })
  @IsString()
  @IsNotEmpty()
  @Length(7, 10)
  nim: string;

  @ApiProperty({ example: 'Andi Wijaya', description: 'Nama lengkap mahasiswa' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({ example: 'andi.wijaya@student.univ.ac.id', description: 'Email mahasiswa' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor telepon', required: false })
  @IsString()
  @IsOptional()
  telepon?: string;

  @ApiProperty({ example: '2021', description: 'Angkatan mahasiswa' })
  @IsString()
  @IsNotEmpty()
  angkatan: string;

  @ApiProperty({ example: 'mhs001', description: 'Username untuk login' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password untuk login' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}

export class UpdateMahasiswaDto {
  @ApiProperty({ example: 'Andi Wijaya', required: false })
  @IsString()
  @IsOptional()
  nama?: string;

  @ApiProperty({ example: 'andi.wijaya@student.univ.ac.id', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '081234567890', required: false })
  @IsString()
  @IsOptional()
  telepon?: string;

  @ApiProperty({ example: '2021', required: false })
  @IsString()
  @IsOptional()
  angkatan?: string;
}