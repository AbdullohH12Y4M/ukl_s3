import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  async create(createMahasiswaDto: CreateMahasiswaDto) {
    const { nim, nama, email, telepon, angkatan, username, password } = createMahasiswaDto;

    // Cek NIM
    const existingNim = await this.prisma.mahasiswa.findUnique({
      where: { nim },
    });
    if (existingNim) {
      throw new ConflictException('NIM sudah terdaftar');
    }

    // Cek email
    const existingEmail = await this.prisma.mahasiswa.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Cek username
    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user dan mahasiswa dalam 1 transaksi
    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: 'MAHASISWA',
        },
      });

      const mahasiswa = await prisma.mahasiswa.create({
        data: {
          nim,
          nama,
          email,
          telepon,
          angkatan,
          userId: user.id,
        },
      });

      return mahasiswa;
    });

    return {
      success: true,
      message: 'Data mahasiswa berhasil ditambahkan',
      data: result,
    };
  }

  async findAll() {
    const mahasiswa = await this.prisma.mahasiswa.findMany({
      orderBy: { nim: 'asc' },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Data mahasiswa berhasil diambil',
      data: mahasiswa,
    };
  }

  async findOne(nim: string) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { nim },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        mahasiswaPenjadwalan: {
          include: {
            penjadwalan: {
              include: {
                matakuliah: true,
                dosen: true,
              },
            },
          },
        },
      },
    });

    if (!mahasiswa) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan');
    }

    return {
      success: true,
      message: 'Data mahasiswa berhasil diambil',
      data: mahasiswa,
    };
  }

  async update(nim: string, updateMahasiswaDto: UpdateMahasiswaDto) {
    const existingMahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (!existingMahasiswa) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan');
    }

    // Cek email jika diubah
    if (updateMahasiswaDto.email && updateMahasiswaDto.email !== existingMahasiswa.email) {
      const emailExists = await this.prisma.mahasiswa.findUnique({
        where: { email: updateMahasiswaDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email sudah digunakan mahasiswa lain');
      }
    }

    const mahasiswa = await this.prisma.mahasiswa.update({
      where: { nim },
      data: updateMahasiswaDto,
    });

    return {
      success: true,
      message: 'Data mahasiswa berhasil diperbarui',
      data: mahasiswa,
    };
  }

  async remove(nim: string) {
    const existingMahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (!existingMahasiswa) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan');
    }

    await this.prisma.mahasiswa.delete({
      where: { nim },
    });

    return {
      success: true,
      message: 'Data mahasiswa berhasil dihapus',
    };
  }
}