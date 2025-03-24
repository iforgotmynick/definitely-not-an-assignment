import { HttpParams, httpResource } from '@angular/common/http';
import { DestroyRef, Injectable, Resource, Signal, WritableSignal, effect, inject, signal } from '@angular/core';
import { BikeList } from '../interfaces/bike-list';
import { BikeCount } from '../interfaces/bike-count';
import { BIKES_PER_PAGE } from '../constants/bikes-per-page';
import { BikeFull } from '../interfaces/bike-full';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private readonly URL: string = 'https://bikeindex.org/api/v3';
  private readonly location: WritableSignal<string> = signal<string>('');
  private readonly page: WritableSignal<number> = signal<number>(1);
  private readonly bikeId: WritableSignal<number | null> = signal<number | null>(null);

  readonly searchValue: WritableSignal<string> = signal<string>('');

  readonly currentPage: Signal<number> = this.page.asReadonly();
  readonly currentLocation: Signal<string> = this.location.asReadonly();

  readonly bikeListResource: Resource<BikeList | undefined> = httpResource<BikeList>(() => {
    const location = this.location();
    const page = this.page();
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', BIKES_PER_PAGE);

    if (location) {
      params = params.set('location', location).set('stolenness', 'proximity').set('distance', 1);
    }

    return {
      url: `${this.URL}/search`,
      params,
    };
  }).asReadonly();

  readonly bikeListCountResource: Resource<BikeCount | undefined> = httpResource<BikeCount>(() => {
    const location = this.location();
    let params = new HttpParams();

    if (location) {
      params = params.set('location', location).set('stolenness', 'proximity').set('distance', 1);
    }

    return {
      url: `${this.URL}/search/count`,
      params,
    };
  }).asReadonly();

  readonly bikeResource: Resource<{bike: BikeFull} | undefined> = httpResource<{bike: BikeFull}>(() => {
    const bikeId = this.bikeId();

    return bikeId ? `${this.URL}/bikes/${this.bikeId()}` : undefined;
  }).asReadonly();

  updatePage(pageNumber: number): void {
    this.page.set(pageNumber);
  }

  updateLocation(location: string): void {
    if (this.location() !== location) {
      this.location.set(location);
      this.updatePage(1);
    }
  }

  updateId(bikeId: number): void {
    this.bikeId.set(bikeId);
  }
}
