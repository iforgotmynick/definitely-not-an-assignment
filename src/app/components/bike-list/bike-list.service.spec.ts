import { TestBed } from '@angular/core/testing';

import { BikeListService } from './bike-list.service';

describe('BikeListService', () => {
  let service: BikeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BikeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
