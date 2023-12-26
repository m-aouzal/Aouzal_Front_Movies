import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const blockLoginGuard: CanActivateFn = (route, state) => {
  // Inject Router to check if the user is logged in
  const router = inject(Router);
  console.log("blockLoginGuard");
  
  // If the user is logged in, prevent access and navigate to login page
  if (localStorage.getItem('userData')) {
    router.navigate(['/recipes']); // Change this to the restricted page URL
    return false;
  }
  
  return true; // Allow access for non-logged in users
};
