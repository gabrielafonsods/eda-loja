import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://neondb_owner:npg_N1XQmze2bwWT@ep-orange-bar-at9x14ve.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require',
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    ProductsModule,
  ],
})
export class AppModule {}