import {createComponentFactory, Spectator, SpyObject} from '@ngneat/spectator';
import {BikeListComponent} from './bike-list.component';
import {BikeService} from '../../service/bike.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {BIKES_PER_PAGE} from '../../constants/bikes-per-page';
import {signal, WritableSignal} from '@angular/core';
import {BikeCount} from '../../interfaces/bike-count';

class MockParamMap implements ParamMap {
  private map = new Map<string, string>();

  constructor(initial?: Record<string, string>) {
    if (initial) {
      Object.entries(initial).forEach(([key, value]) =>
        this.map.set(key, value),
      );
    }
  }

  get(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  getAll(key: string): string[] {
    const value = this.map.get(key);
    return value ? [value] : [];
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  get keys(): string[] {
    return Array.from(this.map.keys());
  }

  set(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('BikeListComponent', () => {
  let spectator: Spectator<BikeListComponent>;
  let component: BikeListComponent;
  let bikeService: SpyObject<BikeService>;
  let router: SpyObject<Router>;
  const paramMap = new BehaviorSubject<ParamMap>(new MockParamMap());
  const bikeServiceMock = {
    bikeListResource: {value: signal(undefined)},
    bikeListCountResource: {value: signal(undefined)},
    currentPage: signal(1) as WritableSignal<number>,
    currentLocation: signal('') as WritableSignal<string>,
    searchValue: signal('') as WritableSignal<string>,
    updatePage: jest.fn(),
    updateLocation: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: BikeListComponent,
    providers: [
      {provide: BikeService, useValue: bikeServiceMock},
      {
        provide: Router,
        useValue: {
          navigate: jest.fn().mockResolvedValue(true),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: paramMap.asObservable(),
        },
      },
    ],
  });

  beforeEach(() => {
    jest.useFakeTimers();
    spectator = createComponent();
    component = spectator.component;
    router = spectator.inject(Router);
    bikeService = spectator.inject(BikeService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation methods', () => {
    it('should navigate to bike detail on bike click', () => {
      component.onBikeClick(123);
      expect(router.navigate).toHaveBeenCalledWith(['/bikes', 123], {
        queryParams: {},
      });
    });

    it('should update to first page', () => {
      component.firstPage();
      expect(bikeService.updatePage).toHaveBeenCalledWith(1);
    });

    it('should update to last page', () => {
      const non = 25;

      (
        bikeService.bikeListCountResource.value as WritableSignal<
          Partial<BikeCount>
        >
      ).set({non});
      component.lastPage();
      expect(bikeService.updatePage).toHaveBeenCalledWith(
        Math.ceil(non / BIKES_PER_PAGE),
      );
    });

    it('should update to previous page', () => {
      (bikeService.currentPage as unknown as WritableSignal<number>).set(3);
      component.prevPage();
      expect(bikeService.updatePage).toHaveBeenCalledWith(2);
    });

    it('should update to next page', () => {
      (bikeService.currentPage as unknown as WritableSignal<number>).set(2);
      component.nextPage();
      expect(bikeService.updatePage).toHaveBeenCalledWith(3);
    });
  });

  describe('search functionality', () => {
    it('should update location after search debounce', () => {
      const location = 'LA';
      const spy = jest.spyOn(bikeService, 'updateLocation');

      component.searchValue.set(location);
      spectator.detectChanges();
      jest.advanceTimersByTime(500);
      expect(spy).toHaveBeenCalledWith(location);
    });
  });

  describe('query params handling', () => {
    it('should update page and location from query params', () => {
      const page = 2;
      const location = 'LA';
      const spy = jest.spyOn(bikeService, 'updatePage');

      const newParamMap = new MockParamMap();
      newParamMap.set('page', String(page));
      newParamMap.set('location', location);
      paramMap.next(newParamMap);

      expect(spy).toHaveBeenCalledWith(page);
      expect(component.searchValue()).toBe(location);
    });
  });

  describe('computed values', () => {
    it('should calculate correct number of pages for non-search results', () => {
      const non = 25;

      (
        bikeService.bikeListCountResource.value as WritableSignal<
          Partial<BikeCount>
        >
      ).set({non});
      expect(component.allPages()).toBe(Math.ceil(non / BIKES_PER_PAGE));
    });

    it('should calculate correct number of pages for search results', () => {
      const proximity = 25;

      component.searchValue.set('test');
      (
        bikeService.bikeListCountResource.value as WritableSignal<
          Partial<BikeCount>
        >
      ).set({
        proximity,
      });
      expect(component.allPages()).toBe(Math.ceil(proximity / BIKES_PER_PAGE));
    });
  });
});
