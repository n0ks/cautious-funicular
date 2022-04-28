import bcrypt from 'bcrypt';
import { Encrypter } from '../../../data/protocols/encrypter';

type Salt = string | number;

export class BcryptAdapter implements Encrypter {
  private readonly salt: Salt;

  constructor(salt: Salt) {
    this.salt = salt;
  }

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }
}
