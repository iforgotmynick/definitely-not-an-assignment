import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'bikes', pathMatch: 'full'},
  {
    path: 'bikes',
    loadComponent: () =>
      import('./components/bike-list/bike-list.component').then(
        (m) => m.BikeListComponent,
      ),
  },
  {
    path: 'bikes/:id',
    loadComponent: () =>
      import('./components/bike-card/bike-card.component').then(
        (m) => m.BikeCardComponent,
      ),
  },
];
