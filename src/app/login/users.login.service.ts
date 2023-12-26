import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { User } from './user.model';

import { catchError, throwError, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UsersloginService {
  constructor(private http: HttpClient,
    private router : Router) {}

  userSubject = new BehaviorSubject<User>(null);
  private tokenExpirationTime : any;
  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4kcqCD1icQ70YH5iYBpDMwfKqfIBvWp8',
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) =>
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTime){
      clearTimeout(this.tokenExpirationTime);
    }
    this.tokenExpirationTime = null;
  }

  autoLogout(expirationDuration : number){
    this.tokenExpirationTime = setTimeout(() => {
      this.logout();
    },expirationDuration);  
  }

  autoLogin(){
    const userData : {
      email : string,
      id : string,
      _token : string,
      _tokenExpirationDate : string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
    if(loadedUser.token){
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.userSubject.next(loadedUser);
    }

  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4kcqCD1icQ70YH5iYBpDMwfKqfIBvWp8',
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    {
      const user = new User(
        email,
        userId,
        token,
        new Date(new Date().getTime() + expiresIn * 1000)
      );
      this.userSubject.next(user);
      localStorage.setItem('userData',JSON.stringify(user));
      this.router.navigate(['/recipes']);
      this.autoLogout(expiresIn * 1000);
    }
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break; // Add break statement here
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
        break; // Add break statement here
      case 'USER_DISABLED':
        errorMessage = 'This user has been disabled';
        break; // Add break statement here
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break; // Add break statement here
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project';
        break; // Add break statement here
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later';
        break; // Add break statement here
      default:
        errorMessage = 'An error has occurred';
        break; // Optional, but recommended to include a break here as well
    }
    return throwError(() => errorMessage);
  }
}

//   // Authenticate a user based on provided email and password
//   authenticateUser(email: string, password: string): Promise<boolean> {
//     return new Promise<boolean>((resolve) => {
//       setTimeout(() => {
//         const authenticatedUser = this.dummyUsers.find(user => user.email === email && user.password === password);
//         if (authenticatedUser) {
//           const token = this.generateAuthToken(); // Generate a token (implement this)
//           localStorage.setItem('role', authenticatedUser.status);
//           localStorage.setItem('authToken', token); // Store the token in localStorage
//           resolve(true); // Resolve with true if authentication is successful
//         } else {
//           resolve(false); // Resolve with false if authentication fails
//         }
//       }, 5000); // Simulate a 5-second delay
//     });
//   }

//   // Get the current authenticated user or return null
//   getCurrentUser(): User | null {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       const authenticatedUser = this.dummyUsers.find(user => user.email === token);
//       return authenticatedUser || null;
//     }
//     return null;
//   }

//   // Check if a user is authenticated
//   isAuthenticated(): boolean {
//     const currentUser = this.getCurrentUser();
//     return currentUser !== null;
//   }

//   // Generate a random authentication token
//   generateAuthToken(): string {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const tokenLength = 32;
//     let token = '';
//     for (let i = 0; i < tokenLength; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       token += characters[randomIndex];
//     }
//     return token;
//   }

//   // Log out the user by removing authentication-related data from localStorage
//   logout() {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userId');
//   }
// }
