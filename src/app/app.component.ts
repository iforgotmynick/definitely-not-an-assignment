import { Component } from '@angular/core';
import { BikeListComponent } from './components/bike-list/bike-list.component';

@Component({
  selector: 'app-root',
  imports: [BikeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'definitely-not-an-assignment';
}
