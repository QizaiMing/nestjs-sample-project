import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    createTask: jest.fn((dto) => {
      return {
        id: '9df812h3fh2398fh12983fh',
        ...dto,
      };
    }),
    updateTask: jest.fn((id: string, dto: CreateTaskDto) => {
      return { id: id, ...dto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', () => {
    expect(
      controller.createTask({
        title: 'testing title',
        description: 'testing description',
        done: false,
      }),
    ).toEqual({
      id: expect.any(String),
      title: 'testing title',
      description: 'testing description',
      done: false,
    });

    expect(mockTasksService.createTask).toHaveBeenCalledWith({
      title: 'testing title',
      description: 'testing description',
      done: false,
    });
  });

  it('should update a task', () => {
    const dto = {
      title: 'update title',
      description: 'update description',
      done: true,
    };

    expect(controller.updateTask(dto, '1')).toEqual({ id: '1', ...dto });
    expect(mockTasksService.updateTask).toHaveBeenCalledWith('1', dto);
  });
});
