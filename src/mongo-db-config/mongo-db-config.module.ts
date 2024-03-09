/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { mongoDbConfig } from './mongo-db-config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => mongoDbConfig,
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDbConfigModule { }
