import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  private readonly todos = new Map<string, Todo>();

  create(createTodoDto: CreateTodoDto): Todo {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: this.createId(),
      title: createTodoDto.title.trim(),
      description: createTodoDto.description?.trim(),
      completed: createTodoDto.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.set(todo.id, todo);
    return todo;
  }

  findAll(): Todo[] {
    return [...this.todos.values()].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
  }

  findOne(id: string): Todo {
    const todo = this.todos.get(id);

    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }

    return todo;
  }

  update(id: string, updateTodoDto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);
    const updated: Todo = {
      ...todo,
      ...updateTodoDto,
      title: updateTodoDto.title?.trim() ?? todo.title,
      description:
        updateTodoDto.description === undefined
          ? todo.description
          : updateTodoDto.description.trim(),
      updatedAt: new Date().toISOString(),
    };

    this.todos.set(id, updated);
    return updated;
  }

  toggle(id: string): Todo {
    const todo = this.findOne(id);
    const updated = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date().toISOString(),
    };

    this.todos.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.todos.delete(id);
  }

  private createId(): string {
    return `todo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
