import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { ArticlesApiService } from './services/articles-api.service';
import { ArticlesLocalStorageService } from './services/articles-local-storage.service';
import { ARTICLES_SERVICE } from './services/articles-service.token';

const articlesServiceClass =
  environment.articlesSource === 'api' ? ArticlesApiService : ArticlesLocalStorageService;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: ARTICLES_SERVICE,
      useClass: articlesServiceClass,
    },
  ],
};
