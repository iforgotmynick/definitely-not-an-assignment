import { ChangeDetectionStrategy, Component, DestroyRef, ModelSignal, Signal, computed, effect, inject, model } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, debounceTime } from 'rxjs';
import { BikeService } from '../../service/bike.service';
import { BikeList } from '../../interfaces/bike-list';
import { Bike } from '../../interfaces/bike';
import { BikeCount } from '../../interfaces/bike-count';
import { BIKES_PER_PAGE } from '../../constants/bikes-per-page';
import { LoadingComponent } from '../loading/loading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bike-list',
  imports: [FormsModule, LoadingComponent],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeListComponent {
  private readonly router = inject(Router);
  private readonly bikeService = inject(BikeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly bikes: Signal<BikeList | undefined> = this.bikeService.bikeListResource.value;
  readonly count: Signal<BikeCount | undefined> = this.bikeService.bikeListCountResource.value;
  readonly currentPage: Signal<number> = this.bikeService.currentPage;
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
      this.bikeService.updateLocation(city);
    });
  });

  onBikeClick(id: number): void {
    this.router.navigate(['/bikes', id]);
  }

  firstPage(): void {
    this.bikeService.updatePage(1);
  }

  lastPage(): void {
    this.bikeService.updatePage(this.allPages());
  }

  prevPage(): void {
    this.bikeService.updatePage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.bikeService.updatePage(this.currentPage() + 1);
  }
}
