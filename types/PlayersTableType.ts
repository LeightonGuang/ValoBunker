import { TeamsTableType } from "./TeamsTableType";

export interface PlayersTableType {
  id: number;
  team_id: number;
  ign: string;
  name: string;
  created_at: string;
  country: string;
  role: string;
  birthday: Date;
  profile_picture_url: string;
  teams: TeamsTableType;
}
