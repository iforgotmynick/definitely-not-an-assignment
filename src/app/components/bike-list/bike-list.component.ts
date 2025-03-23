import { ChangeDetectionStrategy, Component, DestroyRef, ModelSignal, Signal, WritableSignal, computed, effect, inject, model } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, debounceTime } from 'rxjs';
import { BikeListService } from './bike-list.service';
import { BikeList } from '../../interfaces/bike-list';
import { Bike } from '../../interfaces/bike';
import { BikeCount } from '../../interfaces/bike-count';
import { BIKES_PER_PAGE } from '../../constants/bikes-per-page';

@Component({
  selector: 'app-bike-list',
  imports: [FormsModule],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeListComponent {
  private readonly bikeListService = inject(BikeListService);
  private readonly destroyRef = inject(DestroyRef);

  readonly bikes: WritableSignal<BikeList | undefined> = this.bikeListService.bikeListResource.value;
  readonly count: WritableSignal<BikeCount | undefined> = this.bikeListService.bikeListCountResource.value;
  readonly currentPage: Signal<number> = this.bikeListService.currentPage;
  readonly allPages: Signal<number> = computed(() => {
    return Math.ceil((this.count()?.non || 0) / BIKES_PER_PAGE);
  })

  readonly searchValue: ModelSignal<string> = model<string>('');
  readonly searchValueDebounced$: Observable<string> = toObservable(this.searchValue).pipe(
    debounceTime(400)
  );

  private readonly searchEffect = effect(() => {
    this.searchValueDebounced$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((city) => {
      this.bikeListService.updateLocation(city);
    });
  });

  onBikeClick(bike: Bike): void {
    console.log('to bike', bike)
  }

  firstPage(): void {
    this.bikeListService.updatePage(1);
  }

  lastPage(): void {
    this.bikeListService.updatePage(this.allPages());
  }

  prevPage(): void {
    this.bikeListService.updatePage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.bikeListService.updatePage(this.currentPage() + 1);
  }
}
