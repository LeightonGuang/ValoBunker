export interface AbilitiesTableType {
  id: number;
  agent_id: number;
  name: string;
  icon_url: string;
  key_bind: string;
  cost: number;
  charges_on_spawn: number;
  max_charge: number;
  ult_orb_num: number;
  cooldown: number;
  description: string;
}
