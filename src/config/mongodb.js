import { MongoClient } from 'mongodb';
import { config } from '../config/config';

const { uri, dbName } = config.databases.mongodb;

let client;
let db;

export async function connectToDatabase() {
  if (db) {
    return db;
  }

  client = new MongoClient(uri);

  await client.connect();

  db = client.db(dbName);

  return db;
}

export async function disconnectDatabase() {
  if (client) {
    await client.close();
  }
}
