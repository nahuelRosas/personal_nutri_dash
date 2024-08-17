import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { configuration } from './configuration/configuration';
import { configurationValidate } from './configuration/configuration.validate';
import { datasourceOptions } from './configuration/orm.configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResilienceModule } from 'nestjs-resilience';
import { CommonModule } from './common/common.module';
import { AuthenticationModule } from './modules/auth/authentication.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.dist'],
      load: [configuration],
      validationSchema: configurationValidate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    ResilienceModule.forRoot({}),
    AuthenticationModule,
    CommonModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
