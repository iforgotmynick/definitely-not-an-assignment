import {SpectatorService} from '@ngneat/spectator';
import {createServiceFactory} from '@ngneat/spectator/jest';
import {BikeService} from './bike.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {HttpParams, provideHttpClient} from '@angular/common/http';
import {BIKES_PER_PAGE} from '../constants/bikes-per-page';

describe('BikeService', () => {
  let spectator: SpectatorService<BikeService>;
  let service: BikeService;
  let httpController: HttpTestingController;

  const location = 'LA';

  const createService = createServiceFactory({
    service: BikeService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpController = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signals', () => {
    it('should initialize with default values', () => {
      expect(service.currentPage()).toBe(1);
      expect(service.currentLocation()).toBe('');
      expect(service.searchValue()).toBe('');
    });
  });

  describe('update methods', () => {
    it('should update page', () => {
      service.updatePage(2);
      expect(service.currentPage()).toBe(2);
    });

    it('should update location and reset page to 1', () => {
      service.updatePage(2);
      service.updateLocation(location);
      expect(service.currentLocation()).toBe(location);
      expect(service.currentPage()).toBe(1);
    });

    it('should not reset page if same location is updated', () => {
      service.updatePage(2);
      service.updateLocation(location);
      service.updateLocation(location);
      expect(service.currentPage()).toBe(1);
    });

    it('should update bike ID', () => {
      service.updateId(123);
      expect(service.bikeResource).toBeDefined();
    });
  });

  describe('bikeResource', () => {
    it('should not make request when no bike ID is set', () => {
      spectator.flushEffects();
      service.bikeResource.reload();
      httpController.expectNone('https://bikeindex.org/api/v3/bikes/*');
    });

    it('should make request with correct bike ID', () => {
      service.updateId(123);
      spectator.flushEffects();
      service.bikeResource.reload();

      const req = httpController.expectOne(
        'https://bikeindex.org/api/v3/bikes/123',
      );
      expect(req.request.method).toBe('GET');
    });
  });

  describe('bikeListResource', () => {
    it('should make request with default params', () => {
      service.bikeListResource.reload();

      const expectedParams = new HttpParams()
        .set('page', '1')
        .set('per_page', BIKES_PER_PAGE.toString());
      spectator.flushEffects();

      const req = httpController.expectOne(
        (req) =>
          req.url === 'https://bikeindex.org/api/v3/search' &&
          req.params.toString() === expectedParams.toString(),
      );
      expect(req.request.method).toBe('GET');
    });

    it('should include location params when location is set', () => {
      service.updateLocation(location);
      spectator.flushEffects();
      service.bikeListResource.reload();

      const expectedParams = new HttpParams()
        .set('page', '1')
        .set('per_page', BIKES_PER_PAGE.toString())
        .set('location', location)
        .set('stolenness', 'proximity')
        .set('distance', '1');

      const req = httpController.expectOne(
        (req) =>
          req.url === 'https://bikeindex.org/api/v3/search' &&
          req.params.toString() === expectedParams.toString(),
      );
      expect(req.request.method).toBe('GET');
    });
  });

  describe('bikeListCountResource', () => {
    it('should make request with empty params initially', () => {
      service.bikeListCountResource.reload();
      spectator.flushEffects();

      const req = httpController.expectOne(
        (req) =>
          req.url === 'https://bikeindex.org/api/v3/search/count' &&
          req.params.toString() === '',
      );
      expect(req.request.method).toBe('GET');
    });

    it('should include location params when location is set', () => {
      service.updateLocation(location);
      spectator.flushEffects();
      service.bikeListCountResource.reload();

      const expectedParams = new HttpParams()
        .set('location', location)
        .set('stolenness', 'proximity')
        .set('distance', '1');

      const req = httpController.expectOne(
        (req) =>
          req.url === 'https://bikeindex.org/api/v3/search/count' &&
          req.params.toString() === expectedParams.toString(),
      );
      expect(req.request.method).toBe('GET');
    });
  });
});
