import mongoose from 'mongoose';
import { config } from '../../config/index.js';

const { uri, dbName } = config.databases.mongodb;

export async function connectMongoose(): Promise<typeof mongoose> {
  if (!uri) {
    throw new Error('MongoDB URI is not defined in config!');
  }
  if (!dbName) {
    throw new Error('MongoDB database name is not defined in config!');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  await mongoose.connect(uri, {
    dbName,
  });

  return mongoose;
}

// import { MongoClient, Db } from 'mongodb';
// import { config } from '../../config/index.js';

// const { uri, dbName } = config.databases.mongodb;

// export class MongoConnection {
//   private static client: MongoClient | undefined;
//   private static db: Db | undefined;

//   static async connect(): Promise<Db> {
//     if (this.db) {
//       return this.db;
//     }

//     this.client = new MongoClient(uri as string);
//     await this.client.connect();
//     this.db = this.client.db(dbName);

//     return this.db;
//   }

//   static async disconnect(): Promise<void> {
//     if (this.client) {
//       await this.client.close();
//       this.client = undefined;
//       this.db = undefined;
//     }
//   }
// }
