export interface StolenRecord {
  date_stolen: number;
  location: string;
  latitude: number;
  longitude: number;
  theft_description: string | null;
  locking_description: string | null;
  lock_defeat_description: string | null;
  police_report_number: string | null;
  police_report_department: string | null;
  created_at: number;
  create_open311: boolean;
  id: number;
}
