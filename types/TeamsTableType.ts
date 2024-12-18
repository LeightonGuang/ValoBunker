import { CoachesTableType } from "./CoachesTableType";
import { PlayersTableType } from "./PlayersTableType";
import { VctLeaguesTableType } from "./VctLeaguesTableType";

export interface TeamsTableType {
  id: number;
  name: string;
  logo_url: string;
  country: string;
  vct_league: VctLeaguesTableType;
  tag: string;
  created_at: string;
  players: PlayersTableType[];
  coaches: CoachesTableType[];
}
