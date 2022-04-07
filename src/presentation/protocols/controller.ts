import { HttpRequest, HttpResponse } from '.';

export interface Controller {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
