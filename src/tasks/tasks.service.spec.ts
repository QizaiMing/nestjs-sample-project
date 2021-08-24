import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  class mockTaskModel {
    constructor({title, description, done}) {
      this.title = title;
      this.description = description;
      this.done = done;
    }

    title: string;
    description: string;
    done: boolean;

    save = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          id: '2938f23fh23fh923hf9hf',
          title: this.title,
          description: this.description,
          done: this.done,
        }),
      );
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken('Task'), useValue: mockTaskModel },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service.createTask).toBeDefined();
  });

  it('should create a new task record and return that', async () => {
    const dto = {
      title: 'New title',
      description: 'New description',
      done: false
    };

    expect(await service.createTask(dto)).toEqual({
      id: expect.any(String),
      title: dto.title,
      description: dto.description,
      done: dto.done,
    });
  });
});
