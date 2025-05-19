export interface CountdownTableType {
  id?: number;
  name?: string;
  img_url?: string;
  is_same_time?: boolean;
  start_date?: Date | null;
  end_date?: Date | null;
  created_at?: string;
}
