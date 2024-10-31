export interface RoundSmokesDataType {
  id: number;
  imageUrl: string;
  agents: string;
  abilityName: string;
  duration: number;
  radius?: number;
  cost: number;
  regen: {
    reusable: boolean;
    regenTime: number | null;
  };
}
