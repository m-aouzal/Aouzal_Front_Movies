import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder and other necessary modules
import { UsersloginService } from './users.login.service';
import { Router } from '@angular/router';
import { ComponentsForm } from '../ComponentsForm';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AlertComponent],
  selector: 'app-login',
  templateUrl: './login.component.html', // Update with the correct template URL
  styleUrls: ['./login.component.css'], // Update with the correct style URL
})
export class LoginComponent implements ComponentsForm {
  loginForm: FormGroup; // Declare the form group
  signUpForm: FormGroup;
  authFailed: boolean = false;
  loading: boolean = false;
  loadingSignUp: boolean = false;
  loadingLogin: boolean = false;
  error: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersloginService,
    private router: Router
  ) {
    // Inject the FormBuilder service

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}
  verifyChangesAndConfirm(): boolean {
    return (
      !this.loginForm.dirty ||
      window.confirm('You have unsaved changes. Do you really want to leave?')
    );
  }

  onSubmitLogin() {
    this.loadingLogin = true;
    this.submitForm('login');
  }

  onSubmitSignUp() {
    this.loadingSignUp = true;
    this.submitForm('signUp');
  }

  onHandleError() {
    this.error = null;
  }

  private submitForm(mode: string) {
    this.loading = true;
    const formGroup = mode === 'signUp' ? this.signUpForm : this.loginForm;

    if (formGroup.invalid) {
      this.loading = false;
      return;
    }

    const formData = formGroup.value;
    const authObservable =
      mode === 'signUp'
        ? this.usersService.signUp(formData.email, formData.password)
        : this.usersService.login(formData.email, formData.password);

    authObservable.subscribe({
      next: (response) => {
        this.loadingLogin = false;
        this.loadingSignUp = false;
        if (mode !== 'signUp') this.router.navigate(['/recipes']);
        console.log(response);
      },
      error: (err) => {
        this.error = err;
        this.loadingLogin = false;
        this.loadingSignUp = false;
        console.log(err);
      },
    });
    formGroup.reset();
  }
}

//     this.loadingLogin = true;
//     const formData = form.value;
//     this.usersService.login(formData.email, formData.password).subscribe({
//       next: (response) => {
//         setTimeout(() => {
//           this.loading = false;
//         }, 2000);
//         console.log(response);
//       },
//       error: (err) => {
//         setTimeout(() => {
//           this.loading = false;
//           this.error = err;
//         }, 2000);
//         console.log(err);
//       },
//     });
//   }
// }

//   ngOnInit() {
//     if (this.usersService.isAuthenticated()) {
//       // User is already authenticated, redirect or perform an action
//       this.router.navigate(['/recipes']); // Example: Redirect to dashboard
//     }
//   }
//   onSubmit() {
//     this.loading = true; // Set loading to true

//     if (this.loginForm.valid) {
//       const formData = this.loginForm.value;

//       this.usersService.authenticateUser(formData.email, formData.password)
//         .then(userExists => {
//           if (userExists) {
//             this.authFailed = false;
//             this.router.navigate(['/recipes']);
//             // Perform any further actions, like navigation or setting authentication state
//           } else {
//             this.resetAuthentication();
//           }
//           this.loading = false; // Set loading to false after async operation completes
//         });
//     }
//   }

//   resetAuthentication() {
//     this.authFailed = true;
//     this.loginForm.reset();
//   }

// }
