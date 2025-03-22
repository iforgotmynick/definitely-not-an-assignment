import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bike-list',
  imports: [],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeListComponent {

}
