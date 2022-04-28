import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

describe('BcrypdAdapter', () => {
  test('should call bcrypt and hash a value', async () => {
    const salt = 42;
    const bcryptMock = new BcryptAdapter(salt);

    const bcryptSpy = jest.spyOn(bcrypt, 'hash');

    await bcryptMock.encrypt('value');

    expect(bcryptSpy).toHaveBeenCalledWith('value', salt);
  });
});
