import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/Task';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private taskModel: Model<Task>) {}

  async getTasks(): Promise<Task[]> {
    return await this.taskModel.find();
  }

  async getTask(id: string): Promise<Task> {
    return await this.taskModel.findById(id);
  }

  async createTask(task: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(task);
    return await newTask.save();
  }
}
