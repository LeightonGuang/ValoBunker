import { TeamsTableType } from "./TeamsTableType";

enum PlayerRoles {
  ROLE_1 = "1",
  ROLE_2 = "2",
  ROLE_3 = "3",
  ROLE_4 = "4",
  IGL = "IGL",
  Flex = "Flex",
  Sub = "Sub",
  Inactive = "Inactive",
}

export interface PlayersTableType {
  id: number;
  team_id: number;
  ign: string;
  name: string;
  created_at: string;
  country: string;
  roles: PlayerRoles[];
  birthday: Date;
  profile_picture_url: string;
  teams: TeamsTableType;
}
