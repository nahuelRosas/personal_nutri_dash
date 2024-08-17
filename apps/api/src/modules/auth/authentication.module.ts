import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { COGNITO_AUTH } from '@/common/cognito/application/interface/cognito.service.interface';
import { CognitoService } from '@/common/cognito/service/cognito.service';
import { CommonModule } from '@/common/common.module';
import { AuthenticationService } from '@/modules/auth/application/service/authentication.service';

import { UserModule } from '../user/user.module';
import { AccessTokenGuard } from './application/guard/access_token.guard';
import { AuthenticationGuard } from './application/guard/authentication.guard';
import { JwtStrategy } from './application/strategy/jwt.strategy';
import { AuthenticationController } from './interface/authentication.controller';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => CommonModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },

    {
      provide: COGNITO_AUTH,
      useClass: CognitoService,
    },
    AuthenticationController,
    AuthenticationService,
    AccessTokenGuard,
    JwtStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
