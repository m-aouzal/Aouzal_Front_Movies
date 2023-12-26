import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const authCanActivateChildrenGuard: CanActivateChildFn = (childRoute, state) => {
 
  // return localStorage.getItem('role') === 'admin';
  return true
};
