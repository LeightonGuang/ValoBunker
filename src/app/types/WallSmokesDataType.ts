export interface WallSmokesDataType {
  id: number;
  imageUrl: string;
  agent: string;
  abilityName: string;
  duration: number;
  length?: number | string;
  cost: number;
  regen: {
    reusable: boolean;
    regenTime: number | null;
  };
}
