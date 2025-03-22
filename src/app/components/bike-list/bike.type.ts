export interface Bike {
  id: number;
  title: string;
  serial: string;
  stolen_location: string | null;
  date_stolen: number | null;
  frame_colors: string[];
  manufacturer_name: string;
  frame_model: string;
  year: number | null;
  thumb: string | null;
  large_img?: string | null;
  status?: string;
  registration_created_at?: number;
  registration_updated_at?: number;
  stolen?: boolean;
  description?: string;
  location_found?: string;
}
