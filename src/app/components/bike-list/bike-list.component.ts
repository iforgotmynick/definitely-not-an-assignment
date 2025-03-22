import { ChangeDetectionStrategy, Component, WritableResource, WritableSignal, inject } from '@angular/core';
import { BikeListService } from './bike-list.service';
import { BikeList } from './bike-list.type';
import { Bike } from './bike.type';

@Component({
  selector: 'app-bike-list',
  imports: [],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeListComponent {
  private readonly bikeListService = inject(BikeListService);

  readonly bikes: WritableSignal<BikeList | undefined> = this.bikeListService.bikeListResource.value;

  onBikeClick(bike: Bike): void {
    console.log('redirect to', bike)
  }
}
