import { Db, MongoClient } from 'mongodb';
import { MongoConnector } from '../utils/mongo-connector';
import { AccountMDBRepo } from './account';

describe('Account MongoDB', () => {
  let connection: MongoClient;
  let accountRepoMock = new AccountMDBRepo();

  beforeAll(async () => {
    await MongoConnector.connect();

    connection = MongoConnector.connection!;
  });

  afterAll(async () => {
    await MongoConnector.disconnect();
  });

  beforeEach(async () => {
    const collection = await MongoConnector.getCollection('accounts');
    collection.deleteMany({});
  });

  test('should return added account when success', async () => {
    const account = await accountRepoMock.add({
      name: 'any',
      password: 'anypw',
      email: 'email@email.com'
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any');
    expect(account.password).toBe('anypw');
    expect(account.email).toBe('email@email.com');
  });
});
