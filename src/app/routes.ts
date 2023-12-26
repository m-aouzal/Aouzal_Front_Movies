import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FavoritedComponent } from './favorited/favorited.component';
const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
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
    path: '**',
    component: PageNotFoundComponent,
    title: '404',
  },
];

export default routeConfig;
