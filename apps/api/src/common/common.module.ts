import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { COGNITO_AUTH } from './cognito/application/interface/cognito.service.interface';
import { CognitoService } from './cognito/service/cognito.service';
import { AllExceptionsFilter } from './response_service/filter/all_exceptions.filter';
import { RESPONSE_SERVICE } from './response_service/interface/response.interface';
import { ResponseService } from './response_service/service/response.service';

@Module({
  providers: [
    {
      provide: RESPONSE_SERVICE,
      useClass: ResponseService,
    },
    {
      provide: COGNITO_AUTH,
      useClass: CognitoService,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [
    {
      provide: RESPONSE_SERVICE,
      useClass: ResponseService,
    },
    {
      provide: COGNITO_AUTH,
      useClass: CognitoService,
    },
  ],
})
export class CommonModule {}
