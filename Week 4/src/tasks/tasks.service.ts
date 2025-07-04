import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from "./dto/task.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import Redis from "ioredis";

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    @Inject("REDIS_CLIENT") private redis: Redis
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = await this.prisma.task.create({
      data: { ...createTaskDto, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    await this.redis.del(`tasks:${userId}`);
    return task;
  }

  async findAll(
    paginationDto: PaginationDto,
    filterDto: TaskFilterDto,
    userId: number
  ) {
    try {
      const cacheKey = `tasks:${userId}:${JSON.stringify({
        ...paginationDto,
        ...filterDto,
      })}`;

      let cached;
      try {
        cached = await this.redis.get(cacheKey);
      } catch (error) {
        // Redis error, continue without cache
        cached = null;
      }

      if (cached) {
        return JSON.parse(cached);
      }

      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = paginationDto;
      const { status, priority } = filterDto || {};
      const skip = (page - 1) * limit;

      const where: any = { userId };
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
        ];
      }

      const [tasks, total] = await Promise.all([
        this.prisma.task.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { user: { select: { id: true, name: true, email: true } } },
        }),
        this.prisma.task.count({ where }),
      ]);

      const result = {
        data: tasks,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      try {
        await this.redis.set(cacheKey, JSON.stringify(result), "EX", 300);
      } catch (error) {
        // Redis error, continue without caching
      }

      return result;
    } catch (error) {
      console.error("Error in findAll tasks:", error);
      throw error;
    }
  }

  async findOne(id: number, userId: number) {
    return this.prisma.task.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    await this.redis.del(`tasks:${userId}`);
    return task;
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    await this.redis.del(`tasks:${userId}`);
    return task;
  }
}
