import { connectToDatabase } from '../../config/mongodb';
import { ObjectId } from 'mongodb';

export async function find(collection, query = {}, sort = null) {
  const db = await connectToDatabase();
  const cursor = db.collection(collection).find(query);

  if (sort) {
    cursor.sort(sort);
  }

  return cursor.toArray();
}

export async function findOne(collection, query = {}) {
  const db = await connectToDatabase();
  return db.collection(collection).findOne(query);
}

export async function create(collection, doc) {
  const db = await connectToDatabase();
  return db.collection(collection).insertOne(doc);
}

export async function update(collection, filter, updateDoc) {
  const db = await connectToDatabase();
  return db.collection(collection).updateOne(filter, { $set: updateDoc });
}

export async function remove(collection, filter) {
  const db = await connectToDatabase();
  return db.collection(collection).deleteOne(filter);
}

export async function findById(collection, id) {
  const db = await connectToDatabase();
  return db.collection(collection).findOne({ _id: new ObjectId(String(id)) });
}
