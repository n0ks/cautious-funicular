import { Collection, MongoClient } from 'mongodb';

export class MongoConnector {
  public static connection: MongoClient | null;

  static async connect(): Promise<void> {
    this.connection = await MongoClient.connect(process.env.MONGO_URL as string);
  }

  static async disconnect(): Promise<void> {
    this.connection?.close();
  }

  static getCollection(name: string): Collection | never {
    if (this.connection == null) {
      throw Error('connection must be initialized first!');
    }

    return this.connection.db().collection(name);
  }

  static transformWithoutId(obj: any): any {
    if (obj == null) return {};

    const newObj = {} as any;

    Object.assign(newObj, obj, { id: obj?._id });

    delete newObj?._id;

    return newObj;
  }
}
