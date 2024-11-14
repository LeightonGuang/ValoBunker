import { TeamsTableType } from "./TeamsTableType";

export interface PlayersTableType {
  id: number;
  team_id: number;
  ign: string;
  name: string;
  created_at: string;
  country: string;
  role: string;
  age: number;
  profile_picture_url: string;
  teams: TeamsTableType;
}
