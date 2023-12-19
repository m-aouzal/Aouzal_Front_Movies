import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {DetailsComponent} from "./details/details.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {FavoritedComponent} from "./favorited/favorited.component"
const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'favorited',
    component: FavoritedComponent,
    title: 'favorited page'
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details'
  }
  ,{
    path: '**',
    component: NotFoundComponent,
    title: 'Home notfound'
  }

];

export default routeConfig;
