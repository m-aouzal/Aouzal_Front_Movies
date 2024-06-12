import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyFavoritesComponent } from './MyFavorites/MyFavorites.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { blockLoginGuard } from './guards/block-login.guard';
import { AuthGuard } from './guards/auth-can-activate.guard';
import { authDeActivateGuard } from './guards/auth-de-activate.guard';
const routeConfig: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'Myfavorites',
    component: MyFavoritesComponent,
    title: 'My favorites page',
    canActivate: [AuthGuard],
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details',
    canDeactivate: [authDeActivateGuard],
  },
  {
    path: 'About',
    component: AboutComponent,
    title: 'About page',
  },
  { path: '404', component: PageNotFoundComponent },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login page',
    canActivate: [blockLoginGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: '404',
  },
];

export default routeConfig;
