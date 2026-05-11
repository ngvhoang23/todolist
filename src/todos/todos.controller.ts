import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiCreatedResponse({ type: Todo })
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOkResponse({ type: Todo, isArray: true })
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Todo })
  @ApiNotFoundResponse({ description: 'Todo not found' })
  findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Todo })
  @ApiNotFoundResponse({ description: 'Todo not found' })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ type: Todo })
  @ApiNotFoundResponse({ description: 'Todo not found' })
  toggle(@Param('id') id: string): Promise<Todo> {
    return this.todosService.toggle(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Todo deleted' })
  @ApiNotFoundResponse({ description: 'Todo not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.todosService.remove(id);
  }
}
