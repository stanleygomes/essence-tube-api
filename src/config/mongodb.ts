import { MongoClient, Db } from 'mongodb';
import { config } from '../config/config.js';

const { uri, dbName } = config.databases.mongodb;

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  client = new MongoClient(uri as string);

  await client.connect();

  db = client.db(dbName);

  return db;
}

export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}
