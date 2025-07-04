import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import Redis from "ioredis";

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    @Inject("REDIS_CLIENT") private redis: Redis
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const project = await this.prisma.project.create({
      data: { ...createProjectDto, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tasks: true,
      },
    });

    await this.redis.del(`projects:${userId}`);
    return project;
  }

  async findAll(paginationDto: PaginationDto, userId: number) {
    try {
      const cacheKey = `projects:${userId}:${JSON.stringify(paginationDto)}`;

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
      const skip = (page - 1) * limit;

      const where: any = { userId };
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ];
      }

      const [projects, total] = await Promise.all([
        this.prisma.project.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: {
            user: { select: { id: true, name: true, email: true } },
            tasks: { select: { id: true, title: true, status: true } },
          },
        }),
        this.prisma.project.count({ where }),
      ]);

      const result = {
        data: projects,
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
      console.error("Error in findAll projects:", error);
      throw error;
    }
  }

  async findOne(id: number, userId: number) {
    return this.prisma.project.findFirst({
      where: { id, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tasks: true,
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {
    const project = await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        user: { select: { id: true, name: true, email: true } },
        tasks: true,
      },
    });

    await this.redis.del(`projects:${userId}`);
    return project;
  }

  async remove(id: number, userId: number) {
    const project = await this.prisma.project.delete({
      where: { id },
    });

    await this.redis.del(`projects:${userId}`);
    return project;
  }
}
