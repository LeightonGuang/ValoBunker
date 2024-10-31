import { RoundSmokesDataType } from "./RoundSmokesDataType";
import { WallSmokesDataType } from "./WallSmokesDataType";

export interface SmokesDataType {
  roundSmokesData: RoundSmokesDataType[];
  wallSmokesData: WallSmokesDataType[];
}
