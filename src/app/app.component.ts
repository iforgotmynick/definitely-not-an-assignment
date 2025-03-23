import { Component } from '@angular/core';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'definitely-not-an-assignment';
}
