import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Configura appConfig para incluir HttpClientModule
const appConfigWithHttpClient = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(HttpClientModule)  // Asegúrate de que HttpClientModule esté aquí
  ]
};

bootstrapApplication(AppComponent, appConfigWithHttpClient)
  .catch((err) => console.error(err));
