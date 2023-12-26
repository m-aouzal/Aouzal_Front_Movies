import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import {
  BrowserModule,
  bootstrapApplication,
  provideProtractorTestingSupport,
} from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import routeConfig from './app/routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(),
    provideProtractorTestingSupport(),
    provideRouter(routeConfig),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'emiflex-60e21',
          appId: '1:1017945489612:web:940e3e5955a15591830269',
          storageBucket: 'emiflex-60e21.appspot.com',
          apiKey: 'AIzaSyA7rAJiWZ-RFU-ZEXFQfD-4cVsR97dFuro',
          authDomain: 'emiflex-60e21.firebaseapp.com',
          messagingSenderId: '1017945489612',
          measurementId: 'G-MSSQ9GNJBR',
        })
      ),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase())
    ),
  ],
}).catch((err) => console.error(err));
