import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let database: Pick<DatabaseService, 'query'>;

  const now = new Date('2026-05-11T00:00:00.000Z');
  const row = {
    id: 'todo_1',
    title: 'Learn NestJS',
    description: null,
    completed: false,
    created_at: now,
    updated_at: now,
  };

  beforeEach(() => {
    database = {
      query: jest.fn(),
    };
    service = new TodosService(database as DatabaseService);
  });

  it('creates and lists todos', async () => {
    jest
      .mocked(database.query)
      .mockResolvedValueOnce({ rows: [row], rowCount: 1 } as never)
      .mockResolvedValueOnce({ rows: [row], rowCount: 1 } as never);

    const todo = await service.create({ title: '  Learn NestJS  ' });

    expect(todo.title).toBe('Learn NestJS');
    expect(todo.completed).toBe(false);
    await expect(service.findAll()).resolves.toHaveLength(1);
  });

  it('updates a todo', async () => {
    jest.mocked(database.query).mockResolvedValueOnce({
      rows: [
        {
          ...row,
          description: 'Add CRUD endpoints',
          completed: true,
        },
      ],
      rowCount: 1,
    } as never);

    const updated = await service.update(row.id, {
      description: 'Add CRUD endpoints',
      completed: true,
    });

    expect(updated.description).toBe('Add CRUD endpoints');
    expect(updated.completed).toBe(true);
  });

  it('toggles a todo completion state', async () => {
    jest.mocked(database.query).mockResolvedValueOnce({
      rows: [{ ...row, completed: true }],
      rowCount: 1,
    } as never);

    await expect(service.toggle(row.id)).resolves.toMatchObject({
      completed: true,
    });
  });

  it('throws when a todo does not exist', async () => {
    jest.mocked(database.query).mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    } as never);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
