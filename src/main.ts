import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import {BrowserModule, bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import {provideHttpClient,} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import routeConfig from "./app/routes";
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(),
    provideProtractorTestingSupport(),
    provideRouter(routeConfig),
    provideAnimations(),
    provideAnimations()
],
}).catch((err) => console.error(err));
