import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers(); // TODO: protect with admin guard later
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
