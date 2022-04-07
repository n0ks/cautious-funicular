import { InvalidParamError, MissingParamsError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordValidation'];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamsError(field));
      }
    }

    try {
      const isValid = this.emailValidator.isValid(request.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (_) {
      return serverError();
    }

    return { body: '', statusCode: 200 };
  }
}
