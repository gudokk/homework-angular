import { Routes } from '@angular/router';
import { HomePage } from './ui/pages/home/home'
import { BlogPage } from './ui/pages/blog/blog'

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'blog', component: BlogPage }
];
