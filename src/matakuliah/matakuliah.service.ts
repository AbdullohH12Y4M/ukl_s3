import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatakuliahDto } from './dto/create-matakuliah.dto';
import { UpdateMatakuliahDto } from './dto/update-matakuliah.dto';

@Injectable()
export class MatakuliahService {
  constructor(private prisma: PrismaService) {}

  async create(createMatakuliahDto: CreateMatakuliahDto) {
    // Cek apakah kode matakuliah sudah ada
    const existingMatakuliah = await this.prisma.matakuliah.findUnique({
      where: { kode: createMatakuliahDto.kode },
    });

    if (existingMatakuliah) {
      throw new ConflictException('Kode matakuliah sudah terdaftar');
    }

    const matakuliah = await this.prisma.matakuliah.create({
      data: createMatakuliahDto,
    });

    return {
      success: true,
      message: 'Matakuliah berhasil ditambahkan',
      data: matakuliah,
    };
  }

  async findAll() {
    const matakuliah = await this.prisma.matakuliah.findMany({
      orderBy: { semester: 'asc' },
    });

    return {
      success: true,
      message: 'Data matakuliah berhasil diambil',
      data: matakuliah,
    };
  }

  async findOne(id: string) {
    const matakuliah = await this.prisma.matakuliah.findUnique({
      where: { id },
      include: {
        penjadwalan: {
          include: {
            dosen: true,
          },
        },
      },
    });

    if (!matakuliah) {
      throw new NotFoundException('Matakuliah tidak ditemukan');
    }

    return {
      success: true,
      message: 'Data matakuliah berhasil diambil',
      data: matakuliah,
    };
  }

  async update(id: string, updateMatakuliahDto: UpdateMatakuliahDto) {
    // Cek apakah matakuliah ada
    const existingMatakuliah = await this.prisma.matakuliah.findUnique({
      where: { id },
    });

    if (!existingMatakuliah) {
      throw new NotFoundException('Matakuliah tidak ditemukan');
    }

    // Jika kode diubah, cek apakah kode baru sudah digunakan
    if (updateMatakuliahDto.kode && updateMatakuliahDto.kode !== existingMatakuliah.kode) {
      const kodeExists = await this.prisma.matakuliah.findUnique({
        where: { kode: updateMatakuliahDto.kode },
      });

      if (kodeExists) {
        throw new ConflictException('Kode matakuliah sudah digunakan');
      }
    }

    const matakuliah = await this.prisma.matakuliah.update({
      where: { id },
      data: updateMatakuliahDto,
    });

    return {
      success: true,
      message: 'Matakuliah berhasil diperbarui',
      data: matakuliah,
    };
  }

  async remove(id: string) {
    // Cek apakah matakuliah ada
    const existingMatakuliah = await this.prisma.matakuliah.findUnique({
      where: { id },
    });

    if (!existingMatakuliah) {
      throw new NotFoundException('Matakuliah tidak ditemukan');
    }

    await this.prisma.matakuliah.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Matakuliah berhasil dihapus',
    };
  }
}