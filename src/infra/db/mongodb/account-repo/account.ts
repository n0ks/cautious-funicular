import { AddAccountRepository } from '../../../..';
import { AddAccountModel, AccountModel } from '../../../../domain';
import { MongoConnector } from '../utils/mongo-connector';

export class AccountMDBRepo implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accCollection = MongoConnector.getCollection('accounts');

    let acc: (AccountModel & { _id?: string }) | unknown = {};

    const res = await accCollection.insertOne(account);

    if (res.acknowledged) {
      const data = await accCollection.findOne(res.insertedId);
      acc = MongoConnector.transformWithoutId(data);
    }

    return acc as AccountModel;
  }
}
