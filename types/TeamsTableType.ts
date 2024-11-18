import { CoachesTableType } from "./CoachesTableType";
import { PlayersTableType } from "./PlayersTableType";

export interface TeamsTableType {
  id: number;
  name: string;
  logo_url: string;
  country: string;
  vct_league: string;
  tag: string;
  created_at: string;
  players: PlayersTableType[];
  coaches: CoachesTableType[];
}
