/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { SignUpController } from '.';
import { AccountModel, AddAccountModel } from '../../../domain';
import { AddAccount } from '../../../domain/usecases';
import { InvalidParamError } from '../../errors/invalid-param';
import { MissingParamsError } from '../../errors/missing-params';
import { ServerError } from '../../errors/server-error';
import { EmailValidator, HttpRequest } from '../../protocols';

interface SutTypes {
  sut: SignUpController;
  emailValidatorMock: EmailValidator;
  addAccountMock: AddAccount;
}

const makeSut = (): SutTypes => {
  class EmailValidatorMock implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorMock = new EmailValidatorMock();

  const addAccountMock = makeAddAccount();

  const sut = new SignUpController(emailValidatorMock, addAccountMock);

  return {
    sut,
    emailValidatorMock,
    addAccountMock
  };
};

const makeAddAccount = (): AddAccount => {
  class AddAccountMock implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({
          id: 'id',
          name: 'any',
          password: 'anypw',
          email: 'email@email.com'
        })
      );
    }
  }

  return new AddAccountMock();
};

function makeEmailWithTrowableError(): EmailValidator {
  class EmailValidatorMock implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }

  return new EmailValidatorMock();
}

describe('SignUpController', () => {
  let httpReq: HttpRequest;
  let accountModelMock: AccountModel;

  beforeEach(() => {
    httpReq = {
      body: {
        name: 'any',
        password: 'anypw',
        passwordValidation: 'anypw',
        email: 'email@email.com'
      }
    };

    accountModelMock = {
      id: 'id',
      email: 'email@email.com',
      name: 'any',
      password: 'anypw'
    };
  });

  test('should return error if no name', async () => {
    const { sut } = makeSut();

    delete httpReq.body.name;
    const response = await sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('name'));
  });

  test('should return error if email is missing', async () => {
    const { sut } = makeSut();

    delete httpReq.body.email;
    const response = await sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('email'));
  });

  test('should return error if password is missing', async () => {
    const { sut } = makeSut();

    delete httpReq.body.password;

    const response = await sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('password'));
  });

  test('should return error if passwordValidation is missing', async () => {
    const { sut } = makeSut();

    delete httpReq.body.passwordValidation;

    const response = await sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('passwordValidation'));
  });

  test('should return error if email is invalid', async () => {
    const { sut, emailValidatorMock } = makeSut();

    jest.spyOn(emailValidatorMock, 'isValid').mockReturnValueOnce(false);

    const response = await sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with valid email', () => {
    const { sut, emailValidatorMock } = makeSut();

    const emailSpy = jest.spyOn(emailValidatorMock, 'isValid');

    sut.handle(httpReq);

    expect(emailSpy).toHaveBeenCalledWith('email@email.com');
  });

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorMock } = makeSut();

    jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(httpReq);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  test('should return 400 if passwords do not match', async () => {
    const { sut, emailValidatorMock } = makeSut();

    jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    httpReq.body.passwordValidation = 'fodase';
    const response = await sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError('passwordValidation'));
  });

  test('should call AddAccount', async () => {
    const { addAccountMock, sut } = makeSut();

    const spy = jest.spyOn(addAccountMock, 'add');
    const req = {
      body: {
        id: 'id',
        passwordValidation: 'anypw',
        email: 'email@email.com',
        name: 'any',
        password: 'anypw'
      }
    };

    await sut.handle(req);

    expect(spy).toHaveBeenCalledWith({
      email: 'email@email.com',
      name: 'any',
      password: 'anypw'
    });
  });

  test('should return 500 if AddAccount throws', async () => {
    const { addAccountMock, sut } = makeSut();

    const spy = jest.spyOn(addAccountMock, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const req = {
      body: {
        id: 'id',
        passwordValidation: 'anypw',
        email: 'email@email.com',
        name: 'any',
        password: 'anypw'
      }
    };

    await sut.handle(req);

    expect(spy).toHaveBeenCalledWith({
      email: 'email@email.com',
      name: 'any',
      password: 'anypw'
    });
  });

  test('should return 200 if success', async () => {
    const { addAccountMock, sut } = makeSut();

    const res = await sut.handle(httpReq);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(accountModelMock);
  });
});
