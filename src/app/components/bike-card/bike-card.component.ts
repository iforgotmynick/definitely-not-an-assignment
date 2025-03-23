import { Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { Bike } from '../../interfaces/bike';
import { ActivatedRoute } from '@angular/router';
import { BikeService } from '../../service/bike.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-bike-card',
  imports: [LoadingComponent],
  templateUrl: './bike-card.component.html',
  styleUrl: './bike-card.component.scss'
})
export class BikeCardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bikeService = inject(BikeService);

  readonly bike: Signal<Bike | undefined> = this.bikeService.bikeResource.value;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.bikeService.updateId(id);
  }
}
