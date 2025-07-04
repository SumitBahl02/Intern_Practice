import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created successfully', type: ProjectResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', type: String })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', type: String })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)', enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'List of projects with pagination', schema: {
    example: {
      success: true,
      timestamp: '2025-07-04T20:30:00.000Z',
      data: {
        items: [{ id: 1, name: 'E-commerce Platform', status: 'ACTIVE' }],
        meta: { page: 1, limit: 10, totalItems: 5, totalPages: 1 }
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    return this.projectsService.findAll(paginationDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Project found', type: ProjectResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(+id, req.user.id);
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', description: 'Project ID', example: '1' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project updated successfully', type: ProjectResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(+id, updateProjectDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', description: 'Project ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(+id, req.user.id);
  }
}