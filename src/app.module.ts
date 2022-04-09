import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomerModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    CustomerModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
