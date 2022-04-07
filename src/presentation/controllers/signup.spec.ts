/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { InvalidParamError, MissingParamsError, ServerError } from '../errors';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { SignUpController } from './signup';

interface SutTypes {
  sut: SignUpController;
  emailValidatorMock: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorMock implements EmailValidator {
    isValid(email: string): boolean {
      return false;
    }
  }

  const emailValidatorMock = new EmailValidatorMock();

  const sut = new SignUpController(emailValidatorMock);

  return {
    sut,
    emailValidatorMock
  };
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

  beforeEach(() => {
    httpReq = {
      body: {
        name: 'any',
        password: 'anypw',
        passwordValidation: 'anypw',
        email: 'email@email.com'
      }
    };
  });

  test('should return error if no name', () => {
    const { sut } = makeSut();

    delete httpReq.body.name;
    const response = sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('name'));
  });

  test('should return error if email is missing', () => {
    const { sut } = makeSut();

    delete httpReq.body.email;
    const response = sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('email'));
  });

  test('should return error if password is missing', () => {
    const { sut } = makeSut();

    delete httpReq.body.password;

    const response = sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('password'));
  });

  test('should return error if passwordValidation is missing', () => {
    const { sut } = makeSut();

    delete httpReq.body.passwordValidation;

    const response = sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamsError('passwordValidation'));
  });

  test('should return error if email is invalid', () => {
    const { sut, emailValidatorMock } = makeSut();

    jest.spyOn(emailValidatorMock, 'isValid').mockReturnValueOnce(false);

    const response = sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with valid email', () => {
    const { sut, emailValidatorMock } = makeSut();

    const emailSpy = jest.spyOn(emailValidatorMock, 'isValid');

    sut.handle(httpReq);

    expect(emailSpy).toHaveBeenCalledWith('email@email.com');
  });

  test('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorMock } = makeSut();

    jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = sut.handle(httpReq);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });
});
