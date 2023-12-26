import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersloginService } from './Service/users.login.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogLoginComponent } from './shared/dialog-login/dialog-login.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    HomeComponent,
    FlexLayoutModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  pageNotFound: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  isAuthenticated = false;
  userSub: Subscription;
  constructor(
    private router: Router,
    private userLoginService: UsersloginService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userLoginService.autoLogin();
    this.userSub = this.userLoginService.userSubject.subscribe((user) => {
      console.log('user', user);
      this.isAuthenticated = !!user;
    });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.pageNotFound = event.urlAfterRedirects.includes('404');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSub.unsubscribe();
  }
  navigateToAboutPage() {
    this.router.navigate(['/About']);
  }
  navigateToHomePage() {
    this.router.navigate(['/home']);
  }
  onLogout() {
    this.userLoginService.logout();
  }
  onLogin() {
    this.router.navigate(['/login']);
  }
  onOpenFavorites() {
    console.log('this.isAuthenticated', this.isAuthenticated);
    if (this.isAuthenticated) {
      this.router.navigate(['/Myfavorites']);
    } else {
      {
        const dialogRef = this.dialog.open(DialogLoginComponent);

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.router.navigate(['/login']);
          }
        });
      }
    }
  }
}
