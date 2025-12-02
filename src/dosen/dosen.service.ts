import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';

@Injectable()
export class DosenService {
  constructor(private prisma: PrismaService) {}

  async create(createDosenDto: CreateDosenDto) {
    // Cek apakah NIDN sudah ada
    const existingDosen = await this.prisma.dosen.findUnique({
      where: { nidn: createDosenDto.nidn },
    });

    if (existingDosen) {
      throw new ConflictException('NIDN sudah terdaftar');
    }

    // Cek apakah email sudah ada
    const existingEmail = await this.prisma.dosen.findUnique({
      where: { email: createDosenDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const dosen = await this.prisma.dosen.create({
      data: createDosenDto,
    });

    return {
      success: true,
      message: 'Data dosen berhasil ditambahkan',
      data: dosen,
    };
  }

  async findAll() {
    const dosen = await this.prisma.dosen.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Data dosen berhasil diambil',
      data: dosen,
    };
  }

  async findOne(nidn: string) {
    const dosen = await this.prisma.dosen.findUnique({
      where: { nidn },
      include: {
        penjadwalan: {
          include: {
            matakuliah: true,
          },
        },
      },
    });

    if (!dosen) {
      throw new NotFoundException('Data dosen tidak ditemukan');
    }

    return {
      success: true,
      message: 'Data dosen berhasil diambil',
      data: dosen,
    };
  }

  async update(nidn: string, updateDosenDto: UpdateDosenDto) {
    // Cek apakah dosen ada
    const existingDosen = await this.prisma.dosen.findUnique({
      where: { nidn },
    });

    if (!existingDosen) {
      throw new NotFoundException('Data dosen tidak ditemukan');
    }

    // Jika email diubah, cek apakah email baru sudah digunakan
    if (updateDosenDto.email && updateDosenDto.email !== existingDosen.email) {
      const emailExists = await this.prisma.dosen.findUnique({
        where: { email: updateDosenDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email sudah digunakan dosen lain');
      }
    }

    const dosen = await this.prisma.dosen.update({
      where: { nidn },
      data: updateDosenDto,
    });

    return {
      success: true,
      message: 'Data dosen berhasil diperbarui',
      data: dosen,
    };
  }

  async remove(nidn: string) {
    // Cek apakah dosen ada
    const existingDosen = await this.prisma.dosen.findUnique({
      where: { nidn },
    });

    if (!existingDosen) {
      throw new NotFoundException('Data dosen tidak ditemukan');
    }

    await this.prisma.dosen.delete({
      where: { nidn },
    });

    return {
      success: true,
      message: 'Data dosen berhasil dihapus',
    };
  }
}