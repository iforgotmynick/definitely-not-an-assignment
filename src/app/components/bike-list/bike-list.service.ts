import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BikeList } from './bike-list.type';

@Injectable({
  providedIn: 'root'
})
export class BikeListService {
  private readonly URL = 'https://bikeindex.org/api/v3';

  readonly bikeListResource = httpResource<BikeList>(() => ({
    url: `${this.URL}/search`
  }));
}
