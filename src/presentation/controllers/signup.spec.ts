import { SignUpController } from './signup';

describe('SignUpController', () => {
  test('should return error if no name', () => {
    const sut = new SignUpController();

    const httpReq = {
      body: {
        name: 'any',
        email: 'any@any.com',
        password: 'anypw',
        passwordValidation: 'anypw'
      }
    };

    const response = sut.handle(httpReq);

    expect(response.statusCode).toBe(400);
  });
});
