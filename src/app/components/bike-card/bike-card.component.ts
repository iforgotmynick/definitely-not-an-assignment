import { Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { Bike } from '../../interfaces/bike';
import { ActivatedRoute } from '@angular/router';
import { BikeService } from '../../service/bike.service';
import { LoadingComponent } from '../loading/loading.component';
import { BikeFull } from '../../interfaces/bike-full';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bike-card',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './bike-card.component.html',
  styleUrl: './bike-card.component.scss'
})
export class BikeCardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bikeService = inject(BikeService);

  readonly bike: Signal<{bike: BikeFull} | undefined> = this.bikeService.bikeResource.value;
  readonly bikeError: Signal<{ error: {error: string}} | undefined> = this.bikeService.bikeResource.error as Signal<{ error: {error: string}} | undefined>;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.bikeService.updateId(id);
  }
}
