import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

type HealthResponse = {
  status: 'ok';
};

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOkResponse({ description: 'Root health check' })
  root(): HealthResponse {
    return { status: 'ok' };
  }

  @Get('health')
  @ApiOkResponse({ description: 'Health check' })
  health(): HealthResponse {
    return { status: 'ok' };
  }
}
