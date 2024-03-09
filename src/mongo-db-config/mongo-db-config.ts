/* eslint-disable prettier/prettier */

import { MongooseModuleOptions } from "@nestjs/mongoose";

export const mongoDbConfig: MongooseModuleOptions = {
    uri: 'mongodb://root:example@localhost:27017',
    dbName: 'event-processor'
};