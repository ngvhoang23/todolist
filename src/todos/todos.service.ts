import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../database/database.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

type TodoRow = QueryResultRow & {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class TodosService {
  constructor(private readonly database: DatabaseService) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const result = await this.database.query<TodoRow>(
      `
        INSERT INTO todos (id, title, description, completed)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [
        this.createId(),
        createTodoDto.title.trim(),
        createTodoDto.description?.trim() || null,
        createTodoDto.completed ?? false,
      ],
    );

    return this.toTodo(result.rows[0]);
  }

  async findAll(): Promise<Todo[]> {
    const result = await this.database.query<TodoRow>(
      'SELECT * FROM todos ORDER BY created_at DESC',
    );

    return result.rows.map((row) => this.toTodo(row));
  }

  async findOne(id: string): Promise<Todo> {
    const result = await this.database.query<TodoRow>(
      'SELECT * FROM todos WHERE id = $1',
      [id],
    );

    if (!result.rows[0]) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }

    return this.toTodo(result.rows[0]);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const result = await this.database.query<TodoRow>(
      `
        UPDATE todos
        SET
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          completed = COALESCE($4, completed),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [
        id,
        updateTodoDto.title?.trim(),
        updateTodoDto.description?.trim(),
        updateTodoDto.completed,
      ],
    );

    if (!result.rows[0]) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }

    return this.toTodo(result.rows[0]);
  }

  async toggle(id: string): Promise<Todo> {
    const result = await this.database.query<TodoRow>(
      `
        UPDATE todos
        SET completed = NOT completed, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [id],
    );

    if (!result.rows[0]) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }

    return this.toTodo(result.rows[0]);
  }

  async remove(id: string): Promise<void> {
    const result = await this.database.query('DELETE FROM todos WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }
  }

  private createId(): string {
    return `todo_${randomUUID()}`;
  }

  private toTodo(row: TodoRow): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: row.completed,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
