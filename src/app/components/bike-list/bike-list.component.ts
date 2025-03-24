import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BikeService} from '../../service/bike.service';
import {BikeList} from '../../interfaces/bike-list';
import {BikeCount} from '../../interfaces/bike-count';
import {BIKES_PER_PAGE} from '../../constants/bikes-per-page';
import {LoadingComponent} from '../loading/loading.component';
import {toObservable, takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable, debounceTime, distinctUntilChanged} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-bike-list',
  imports: [FormsModule, LoadingComponent],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BikeListComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bikeService = inject(BikeService);

  readonly bikes: Signal<BikeList | undefined> =
    this.bikeService.bikeListResource.value;
  readonly count: Signal<BikeCount | undefined> =
    this.bikeService.bikeListCountResource.value;
  readonly currentPage: Signal<number> = this.bikeService.currentPage;
  readonly currentLocation: Signal<string> = this.bikeService.currentLocation;
  readonly allPages: Signal<number> = computed(() => {
    const searchValue: string = this.searchValue();
    const totalBikes: number =
      (searchValue
        ? this.count()?.proximity || this.count()?.non
        : this.count()?.non) || 0;

    return Math.ceil(totalBikes / BIKES_PER_PAGE);
  });

  readonly searchValue: WritableSignal<string> = this.bikeService.searchValue;
  private readonly searchValueDebounced$: Observable<string> = toObservable(
    this.searchValue,
  ).pipe(debounceTime(400), distinctUntilChanged());

  constructor() {
    this.subscribeToSearch();
    this.subscribeToQueryParams();
    this.updateQueryParamsEffect();
  }

  onBikeClick(id: number): void {
    this.router.navigate(['/bikes', id], {queryParams: {}});
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

  private subscribeToSearch(): void {
    this.searchValueDebounced$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((location) => {
        this.bikeService.updateLocation(location);
      });
  }

  private subscribeToQueryParams(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const page = Number(params.get('page'));
        const location = params.get('location');

        if (!isNaN(page) && page !== this.currentPage())
          this.bikeService.updatePage(page || 1);
        if (location && location !== this.currentLocation())
          this.searchValue.set(location);
      });
  }

  private updateQueryParamsEffect(): void {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: this.currentPage(),
          location: this.currentLocation(),
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }
}
