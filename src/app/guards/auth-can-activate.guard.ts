import { CanActivateFn, Router } from '@angular/router';
import { UsersloginService } from '../Service/users.login.service';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersloginService);
  const router = inject(Router);
  return usersService.userSubject.pipe(
    take(1),
    map((user) => {
      if (!!user) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    })
  );
};
