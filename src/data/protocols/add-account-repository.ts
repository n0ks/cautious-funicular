import { AccountModel, AddAccountModel } from '../..';

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
