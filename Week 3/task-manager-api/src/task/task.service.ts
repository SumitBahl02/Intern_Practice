import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? 'pending',
        userId,
        projectId: dto.projectId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async findOne(userId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(userId: number, taskId: number, dto: UpdateTaskDto) {
    await this.findOne(userId, taskId); // validates access

    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
    });
  }

  async remove(userId: number, taskId: number) {
    await this.findOne(userId, taskId); // validates access

    return this.prisma.task.delete({ where: { id: taskId } });
  }

  async getComments(taskId: number) {
    return this.prisma.comment.findMany({ where: { taskId } });
  }
}
