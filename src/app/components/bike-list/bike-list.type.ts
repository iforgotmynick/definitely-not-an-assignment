import { Bike } from "./bike.type";

export interface BikeList {
  bikes: Bike[];
  results_count: number;
  page: number;
  bike_thefts?: Record<string, unknown>;
}
