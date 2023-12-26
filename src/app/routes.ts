import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FavoritedComponent } from './favorited/favorited.component';
import { AboutComponent } from './about/about.component';
const routeConfig: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'favorited',
    component: FavoritedComponent,
    title: 'favorited page',
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details',
  },
  {
    path: 'About',
    component: AboutComponent,
    title: 'About page',
  },
  { path: '404', component: PageNotFoundComponent },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: '404',
  },
];

export default routeConfig;
