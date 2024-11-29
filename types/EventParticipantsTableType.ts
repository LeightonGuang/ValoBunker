import { TeamsTableType } from "./TeamsTableType";

export interface EventParticipantsTableType {
  id: number;
  event_id: number;
  team_id: number;
  seeding: string;
  teams: TeamsTableType;
  created_at: string;
}
