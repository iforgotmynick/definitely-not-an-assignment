import {Bike} from './bike';

export interface BikeList {
  bikes: Bike[];
  results_count: number;
  page: number;
  bike_thefts?: Record<string, unknown>;
}
