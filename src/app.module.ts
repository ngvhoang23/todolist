import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule],
  controllers: [AppController],
})
export class AppModule {}
