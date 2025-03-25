import {createComponentFactory, Spectator, SpyObject} from '@ngneat/spectator';
import {BikeCardComponent} from './bike-card.component';
import {BikeService} from '../../service/bike.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {signal, WritableSignal} from '@angular/core';
import {BikeFull} from '../../interfaces/bike-full';

describe('BikeCardComponent', () => {
  let spectator: Spectator<BikeCardComponent>;
  let component: BikeCardComponent;
  let bikeService: SpyObject<BikeService>;
  let location: SpyObject<Location>;

  const mockBike: Partial<BikeFull> = {
    id: 123,
    title: 'test',
    serial: '123',
    manufacturer_name: 'test',
    frame_model: 'test',
    year: 123,
    frame_colors: ['Red'],
    thumb: 'test.jpg',
    stolen: false,
    date_stolen: 123,
    description: 'test',
    location_found: 'test',
  };

  const createComponent = createComponentFactory({
    component: BikeCardComponent,
    providers: [
      {
        provide: BikeService,
        useValue: {
          bikeResource: {
            value: signal<{bike: BikeFull} | undefined>(undefined),
            error: signal<{error: {error: string}} | undefined>(undefined),
          },
          updateId: jest.fn(),
        },
      },
      {
        provide: Location,
        useValue: {
          back: jest.fn(),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: jest.fn().mockReturnValue('123'),
            } as Partial<ParamMap>,
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    bikeService = spectator.inject(BikeService);
    location = spectator.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should get bike ID from route params and update service', () => {
      expect(bikeService.updateId).toHaveBeenCalledWith(123);
    });
  });

  describe('bike data handling', () => {
    it('should display bike data when available', () => {
      (
        bikeService.bikeResource.value as WritableSignal<{
          bike: Partial<BikeFull>;
        }>
      ).set({bike: mockBike});
      spectator.detectChanges();

      expect(component.bike()).toEqual({bike: mockBike});
    });

    it('should handle error state', () => {
      const error = {error: {error: 'Bike not found'}};
      (bikeService.bikeResource.error as WritableSignal<unknown>).set(error);
      spectator.detectChanges();

      expect(component.bikeError()).toEqual(error);
    });
  });

  describe('navigation', () => {
    it('should navigate back when goBack is called', () => {
      component.goBack();
      expect(location.back).toHaveBeenCalled();
    });
  });

  it('should display error message when bike fetch fails', () => {
    const error = {error: {error: 'Bike not found'}};
    (bikeService.bikeResource.error as WritableSignal<unknown>).set(error);
    spectator.detectChanges();

    const errorElement = spectator.query('.error-message');
    expect(errorElement?.textContent).toEqual('Bike not found');
  });
});
