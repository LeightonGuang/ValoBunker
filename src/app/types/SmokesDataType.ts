import { CircularSmokesDataType } from "./CircularSmokesDataType";
import { WallSmokesDataType } from "./WallSmokesDataType";

export interface SmokesDataType {
  circularSmokesData: CircularSmokesDataType[];
  wallSmokesData: WallSmokesDataType[];
}
