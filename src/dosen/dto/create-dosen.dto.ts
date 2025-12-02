import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateDosenDto {
  @ApiProperty({
    example: '0123456789',
    description: 'NIDN Dosen (10 digit)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'NIDN harus 10 digit' })
  nidn: string;

  @ApiProperty({
    example: 'Dr. Budi Santoso, M.Kom',
    description: 'Nama lengkap dosen',
  })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({
    example: 'budi.santoso@univ.ac.id',
    description: 'Email dosen',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '081234567890',
    description: 'Nomor telepon dosen',
    required: false,
  })
  @IsString()
  @IsOptional()
  telepon?: string;
}
