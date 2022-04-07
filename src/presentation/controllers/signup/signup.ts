import {
  badRequest,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  InvalidParamError,
  MissingParamsError,
  serverError,
  serverOk
} from '../..';
import { AddAccount } from '../../..';
import { Controller } from '../../protocols/controller';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'passwordValidation'];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamsError(field));
      }
    }

    const { name, password, passwordValidation, email } = request.body;

    try {
      if (password != passwordValidation) {
        return badRequest(new InvalidParamError('passwordValidation'));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const acc = await this.addAccount.add({
        email,
        name,
        password
      });

      return serverOk(acc);
    } catch (_) {
      return serverError();
    }

    return { body: '', statusCode: 200 };
  }
}
