import { MatchesTableType } from "./MatchesTableType";
import { EventParticipantsTableType } from "./EventParticipantsTableType";

export interface EventsTableType {
  id: number;
  type: string;
  name: string;
  event_icon_url: string;
  start_date?: string;
  end_date?: string;
  prize_pool?: string;
  location: string;
  event_participants: EventParticipantsTableType[];
  matches: MatchesTableType[];
  created_at: string;
}
