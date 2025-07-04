import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers(); // TODO: protect with admin guard later
  }

  // Search by ID or name
  @Get('search')
  searchUsers(
    @Query('q') query?: string,
    @Query('id') id?: string,
    @Query('name') name?: string,
  ) {
    return this.userService.searchUsers({ query, id, name });
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get(':id/tasks')
  getUserTasks(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserTasks(id);
  }

  @Get(':id/projects')
  getUserProjects(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserProjects(id);
  }

  @Get(':id/comments')
  getUserComments(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserComments(id);
  }
}
