import { HttpParams, httpResource } from '@angular/common/http';
import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { BikeList } from '../../interfaces/bike-list';
import { BikeCount } from '../../interfaces/bike-count';
import { BIKES_PER_PAGE } from '../../constants/bikes-per-page';

@Injectable({
  providedIn: 'root'
})
export class BikeListService {
  private readonly URL = 'https://bikeindex.org/api/v3';

  private readonly location: WritableSignal<string> = signal<string>('');
  private readonly page: WritableSignal<number> = signal<number>(1);

  readonly bikeListResource = httpResource<BikeList>(() => {
    const location = this.location();
    const page = this.page();
    const params = new HttpParams()
      .set('page', page)
      .set('per_page', BIKES_PER_PAGE)
      .set('location', location);

    return {
      url: `${this.URL}/search`,
      params,
    };
  });

  readonly bikeListCountResource = httpResource<BikeCount>(() => {
    const location = this.location();
    const page = this.page();
    const params = new HttpParams()
      .set('page', page)
      .set('per_page', BIKES_PER_PAGE)
      .set('location', location);

    return {
      url: `${this.URL}/search/count`,
      params,
    };
  });

  readonly currentPage: Signal<number> = this.page.asReadonly();

  updatePage(pageNumber: number): void {
    this.page.set(pageNumber);
  }

  updateLocation(location: string): void {
    this.location.set(location);
    this.updatePage(1);
  }
}
