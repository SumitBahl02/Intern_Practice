import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers() {
    return this.userService.getAllUsers(); // TODO: protect with admin guard later
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by query, ID, or name' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'id', required: false, description: 'User ID' })
  @ApiQuery({ name: 'name', required: false, description: 'User name' })
  searchUsers(
    @Query('q') query?: string,
    @Query('id') id?: string,
    @Query('name') name?: string,
  ) {
    return this.userService.searchUsers({ query, id, name });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all tasks for a specific user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  getUserTasks(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserTasks(id);
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'Get all projects for a specific user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  getUserProjects(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserProjects(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get all comments for a specific user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  getUserComments(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserComments(id);
  }
}
