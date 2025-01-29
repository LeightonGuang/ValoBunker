export interface AbilitiesTableType {
  id: number;
  name: string;
  agent_id: number;
  category: string;
  icon_url: string;
  key_bind: string;
  cost: number;
  charges_on_spawn: number;
  max_charge: number;
  ult_points: number;
  health: number;
  recall_cooldown: number;
  deploy_cooldown: string;
  regen_on_kills: number;
  duration: string;
  length: number;
  radius: number;
  description: string;
  created_at: string;
}
