import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => {
  return {
    async hash(): Promise<string> {
      return new Promise((r) => r('42'));
    }
  };
});

describe('BcryptAdapter', () => {
  let salt: number;
  let bcryptMock: BcryptAdapter;

  beforeAll(() => {
    salt = 42;
    bcryptMock = new BcryptAdapter(salt);
  });

  test('should call bcrypt and hash a value', async () => {
    const bcryptSpy = jest.spyOn(bcrypt, 'hash');

    const hashedValue = await bcryptMock.encrypt('value');

    expect(bcryptSpy).toHaveBeenCalledWith('value', salt);

    expect(hashedValue).toBe('42');
  });

  test('should throw bcrypt exception', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(bcryptMock.encrypt('value')).rejects.toThrow();
  });
});
