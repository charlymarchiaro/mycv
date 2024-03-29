import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {APP_PIPE} from "@nestjs/core";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {ReportsModule} from './reports/reports.module';
import {User} from "./users/user.entity";
import {Report} from "./reports/report.entity";

const cookieSession = require("cookie-session");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        entities: [User, Report],
        synchronize: true,
      })
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
       cookieSession({
         keys: ['as8f7jdsfdas78fas9ksdfsa8f7askfasd7fs8fkñ'],
       }),
    )
       .forRoutes('*');
  }
}
