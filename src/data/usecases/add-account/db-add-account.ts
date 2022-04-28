import { AddAccount } from '../../..';
import { AddAccountModel, AccountModel } from '../../../domain';
import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly repository: AddAccountRepository;

  constructor(encrypter: Encrypter, repository: AddAccountRepository) {
    this.encrypter = encrypter;
    this.repository = repository;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPw = await this.encrypter.encrypt(account.password);

    return await this.repository.add(Object.assign({}, account, { password: hashedPw }));
  }
}
