import { connectToDatabase } from '../../config/mongodb.js';
import { ObjectId, Db, Sort, Document, WithId, Filter, OptionalUnlessRequiredId } from 'mongodb';

export async function find<T extends Document = Document>(
  collection: string,
  query: Record<string, any> = {},
  sort: Sort | null = null
): Promise<WithId<T>[]> {
  const db: Db = await connectToDatabase();
  const cursor = db.collection<T>(collection).find(query);

  if (sort) {
    cursor.sort(sort);
  }

  return cursor.toArray();
}

export async function findOne<T extends Document = Document>(
  collection: string,
  query: Record<string, any> = {}
): Promise<WithId<T> | null> {
  const db: Db = await connectToDatabase();
  return db.collection<T>(collection).findOne(query);
}

export async function create<T extends Document = Document>(
  collection: string,
  doc: OptionalUnlessRequiredId<T>
): Promise<any> {
  const db: Db = await connectToDatabase();
  return db.collection<T>(collection).insertOne(doc);
}

export async function update<T extends Document = Document>(
  collection: string,
  filter: Record<string, any>,
  updateDoc: Partial<T>
): Promise<any> {
  const db: Db = await connectToDatabase();
  return db.collection<T>(collection).updateOne(filter, { $set: updateDoc });
}

export async function remove(
  collection: string,
  filter: Record<string, any>
): Promise<any> {
  const db: Db = await connectToDatabase();
  return db.collection(collection).deleteOne(filter);
}

export async function findById<T extends Document = Document>(
  collection: string,
  id: string | ObjectId
): Promise<WithId<T> | null> {
  const db: Db = await connectToDatabase();
  return db
    .collection<T>(collection)
    .findOne({ _id: new ObjectId(String(id)) } as Filter<T>);
}
