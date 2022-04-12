import { EmailValidator } from '..';
import { EmailValidatorAdapter } from './email-validator';
import validator from 'validator';

// jest.mock('validator', () => {
//   return {
//     isEmail: function () {
//       return false;
//     }
//   };
// });

describe('EmailValidator adapter', () => {
  let emailValidator: EmailValidator;

  beforeAll(() => {
    emailValidator = new EmailValidatorAdapter();
  });

  test('should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = emailValidator.isValid('emailfodase');

    expect(isValid).toBe(false);
  });

  test('should return true if validator returns true', () => {
    const isValid = emailValidator.isValid('email@email.com');

    expect(isValid).toBe(true);
  });

  test('should check if correct email is being passed', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    emailValidator.isValid('email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('email@email.com');
  });
});
