import { DbAddAccount, Encrypter } from '../..';
import { AccountModel, AddAccountModel } from '../../..';
import { AddAccountRepository } from '../../protocols/add-account-repository';

class EncryptMock implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return new Promise((r) => r('hash_pw'));
  }
}

class AddAccountRepositoryMock implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    return new Promise((resolve) =>
      resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hash_pw'
      })
    );
  }
}

describe('DbAddAccount usecase', () => {
  let dbAddAccount: DbAddAccount;
  let encryptMock: EncryptMock;
  let addAccountRepoMock: AddAccountRepositoryMock;

  const account = {
    name: 'name',
    email: 'email@email.com',
    password: 'any_pw'
  };

  beforeAll(() => {
    encryptMock = new EncryptMock();
    addAccountRepoMock = new AddAccountRepositoryMock();
    dbAddAccount = new DbAddAccount(encryptMock, addAccountRepoMock);
  });

  test('should call Encrypter with correct password', async () => {
    const encryptSpy = jest.spyOn(encryptMock, 'encrypt');

    await dbAddAccount.add(account);
    expect(encryptSpy).toHaveBeenCalledWith('any_pw');
  });

  test('should throw error if encrypt fails', async () => {
    jest.spyOn(encryptMock, 'encrypt').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const prom = dbAddAccount.add(account);
    await expect(prom).rejects.toThrowError();
  });

  test('should call AddAccountRepository and return account', async () => {
    const repoSpy = jest.spyOn(addAccountRepoMock, 'add');

    const dbAcc = await dbAddAccount.add(account);

    expect(repoSpy).toHaveBeenCalledWith({ ...account, password: 'hash_pw' });

    expect(dbAcc).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hash_pw'
    });
  });
});
