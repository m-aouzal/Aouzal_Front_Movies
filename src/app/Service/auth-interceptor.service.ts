import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersloginService } from './users.login.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private userLoginService: UsersloginService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.userLoginService.userSubject.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) return next.handle(req);
        const modifiedReq = req.clone({
          params: req.params.set('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
