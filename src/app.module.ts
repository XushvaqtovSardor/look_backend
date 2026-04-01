import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { FoodsModule } from './modules/foods/foods.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

const isLocalHost = (host: string): boolean => {
  return ['localhost', '127.0.0.1'].includes(host.toLowerCase());
};

const shouldUseSsl = (host: string, sslMode?: string | null): boolean => {
  const normalizedSslMode = sslMode?.toLowerCase();

  if (normalizedSslMode === 'disable') {
    return false;
  }

  if (normalizedSslMode === 'require' || normalizedSslMode === 'verify-ca' || normalizedSslMode === 'verify-full') {
    return true;
  }

  return !isLocalHost(host);
};

const buildSequelizeConfig = (config: ConfigService): SequelizeModuleOptions => {
  const databaseUrl = config.get<string>('NEON_DATABASE_URL') ?? config.get<string>('DATABASE_URL');

  if (databaseUrl) {
    const parsedUrl = new URL(databaseUrl);
    const sslMode = parsedUrl.searchParams.get('sslmode');
    const channelBinding = parsedUrl.searchParams.get('channel_binding');
    const sslEnabled = shouldUseSsl(parsedUrl.hostname, sslMode);

    return {
      dialect: 'postgres' as const,
      host: parsedUrl.hostname,
      port: parsedUrl.port ? Number(parsedUrl.port) : 5432,
      database: parsedUrl.pathname.replace(/^\//, ''),
      username: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      dialectOptions: {
        ...(sslEnabled
          ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
          : {}),
        ...(channelBinding === 'require' ? { enableChannelBinding: true } : {}),
      },
      models: [],
      autoLoadModels: true,
      synchronize: true,
      logging: true,
    };
  }

  const host = config.get<string>('DB_HOST') ?? 'localhost';
  const sslMode = config.get<string>('DB_SSLMODE');
  const sslEnabled = shouldUseSsl(host, sslMode);

  return {
    dialect: 'postgres' as const,
    host,
    port: Number(config.get('DB_PORT') ?? 5432),
    database: config.get('DB_DATABASE'),
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    dialectOptions: {
      ...(sslEnabled
        ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
        : {}),
    },
    models: [],
    autoLoadModels: true,
    synchronize: true,
    logging: true,
  };
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildSequelizeConfig(config)
    }),
    UsersModule,
    FoodsModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
