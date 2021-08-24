import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/Task';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  // getTasks(@Req() req: Request, @Res() res: Response): Task[] {
  //   return res.send(this.tasksService.getTasks());
  // }
  getTasks(): Promise<Task[]> {
    const tasks = this.tasksService.getTasks();
    if (!tasks) throw new NotFoundException('There are no tasks');
    return tasks;
  }

  @Get(':id')
  getTask(@Param('id') id: string): Promise<Task> {
    const task = this.tasksService.getTask(id);
    if (!task) throw new NotFoundException('Task does not exist');
    return task;
  }

  @Post()
  createTask(@Body() task: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(task);
  }

  @Put(':id')
  updateTask(
    @Body() task: CreateTaskDto,
    @Param('id') id: string,
  ): Promise<Task> {
    const updatedTask = this.tasksService.updateTask(id, task);
    if (!updatedTask) throw new NotFoundException('Task does not exist');
    return updatedTask;
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<any> {
    const taskDeleted = await this.tasksService.deleteTask(id);
    return taskDeleted;
  }
}
