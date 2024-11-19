import { AbilitiesTableType } from "./AbilitiesTableType";
import { RolesTableType } from "./RolesTableType";

export interface AgentsTableType {
  id: number;
  name: string;
  role_id: number;
  icon_url: string;
  release_date: string;
  created_at: string;
  roles: RolesTableType;
  abilities: AbilitiesTableType[];
}
