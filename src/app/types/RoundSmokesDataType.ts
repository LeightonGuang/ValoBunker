export interface RoundSmokesDataType {
  id: number;
  imageUrl: string;
  agent: string;
  abilityName: string;
  duration: number;
  radius?: number;
  cost: number;
  regen: {
    reusable: boolean;
    regenTime: number | null;
  };
}
