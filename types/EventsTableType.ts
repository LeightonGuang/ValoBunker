export interface EventsTableType {
  id: number;
  type: string;
  name: string;
  event_icon_url: string;
  start_date?: string;
  end_date?: string;
  prize_pool?: string;
  location: string;
  created_at: string;
}
