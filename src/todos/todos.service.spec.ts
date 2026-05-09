import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    service = new TodosService();
  });

  it('creates and lists todos', () => {
    const todo = service.create({ title: '  Learn NestJS  ' });

    expect(todo.title).toBe('Learn NestJS');
    expect(todo.completed).toBe(false);
    expect(service.findAll()).toHaveLength(1);
  });

  it('updates a todo', () => {
    const todo = service.create({ title: 'Write demo' });
    const updated = service.update(todo.id, {
      description: 'Add CRUD endpoints',
      completed: true,
    });

    expect(updated.description).toBe('Add CRUD endpoints');
    expect(updated.completed).toBe(true);
  });

  it('toggles a todo completion state', () => {
    const todo = service.create({ title: 'Toggle me' });

    expect(service.toggle(todo.id).completed).toBe(true);
    expect(service.toggle(todo.id).completed).toBe(false);
  });

  it('throws when a todo does not exist', () => {
    expect(() => service.findOne('missing')).toThrow(NotFoundException);
  });
});
