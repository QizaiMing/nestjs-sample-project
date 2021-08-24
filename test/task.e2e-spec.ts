import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TasksModule } from '../src/tasks/tasks.module';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  class mockTaskModel {
    constructor({ title, description, done }: CreateTaskDto) {
      this.title = title;
      this.description = description;
      this.done = done;
    }

    title: string;
    description: string;
    done: boolean;

    find() {}

    static find = jest.fn().mockResolvedValue([]);

    save = jest.fn(() =>
      Promise.resolve({
        id: '0920h3f23f9j23f8j2f3',
        title: this.title,
        description: this.description,
        done: this.done,
      }),
    );
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
    })
      .overrideProvider(getModelToken('Task'))
      .useValue(mockTaskModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
  });

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'bob', description: 'descbob', done: false })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(String),
          title: 'bob',
          description: 'descbob',
          done: false,
        });
      });
  });

  it('/tasks (POST) --> 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 123123, done: false })
      .expect('Content-Type', /json/)
      .expect(400, {
        statusCode: 400,
        message: [
          'title must be a string',
          'title should not be empty',
          'description must be a string',
        ],
        error: 'Bad Request',
      });
  });
});
