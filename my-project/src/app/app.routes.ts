import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/pages/home/home').then(m => m.HomePage)
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./ui/pages/blog/blog').then(m => m.BlogPage)
  }
];