import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty({ example: 'todo_1715150000000_ab12cd' })
  id: string;

  @ApiProperty({ example: 'Buy milk' })
  title: string;

  @ApiProperty({
    example: 'Pick up oat milk and coffee on the way home',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2026-05-09T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-09T12:10:00.000Z' })
  updatedAt: string;
}
