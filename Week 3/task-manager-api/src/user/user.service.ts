import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('User already exists');

    const hash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserTasks(id: number) {
    return this.prisma.task.findMany({ where: { userId: id } });
  }

  async getUserProjects(id: number) {
    return this.prisma.project.findMany({ where: { userId: id } });
  }

  async getUserComments(id: number) {
    return this.prisma.comment.findMany({ where: { userId: id } });
  }

  // Search by id and/or name
  async searchUsers(params: { query?: string; id?: string; name?: string }) {
    if (params.query) {
      const numericId = parseInt(params.query);
      return this.prisma.user.findMany({
        where: {
          OR: [
            !isNaN(numericId) ? { id: numericId } : {},
            {
              name: {
                contains: params.query,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }

    const filters: any = {};
    if (params.id) {
      const id = parseInt(params.id);
      if (!isNaN(id)) filters.id = id;
    }
    if (params.name) {
      filters.name = {
        contains: params.name,
      };
    }

    return this.prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
