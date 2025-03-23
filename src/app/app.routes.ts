import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'bike-list', pathMatch: 'full' },
  { path: 'bike-list', loadComponent: () => import('./components/bike-list/bike-list.component').then(m => m.BikeListComponent) },
];
