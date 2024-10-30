"use client";

import { useState } from "react";
import * as smokesData from "../../../../public/data/smokesData.json";

interface RoundSmokesDataType {
  id: number;
  imageUrl: string;
  agents: string;
  abilityName: string;
  duration: number;
  radius: number;
  cost: number;
  regen: {
    reusable: boolean;
    regenTime: number | null;
  };
}

interface WallSmokesDataType {
  id: number;
  imageUrl: string;
  agents: string;
  abilityName: string;
  duration: number;
  length: number;
  cost: number;
  regen: {
    reusable: boolean;
    regenTime: number | null;
  };
}

const SmokesPage = () => {
  const [isAsc, setIsAsc] = useState<{
    roundSmokes: boolean;
    wallSmokes: boolean;
  }>({
    roundSmokes: true,
    wallSmokes: true,
  });
  const [sortedBy, setSortedBy] = useState<{
    roundSmokes: string | null;
    wallSmokes: string | null;
  }>({
    roundSmokes: "agents",
    wallSmokes: "agents",
  });

  const sortList = <T extends RoundSmokesDataType | WallSmokesDataType>(
    list: T[],
    column: keyof T,
    isAsc: boolean,
  ): T[] => {
    const sorted = [...list].sort((a: T, b: T) =>
      isAsc
        ? a[column] < b[column]
          ? -1
          : a[column] > b[column]
            ? 1
            : 0
        : a[column] > b[column]
          ? -1
          : a[column] < b[column]
            ? 1
            : 0,
    );

    return sorted;
  };

  const [roundSmokesList, setRoundSmokesList] = useState<RoundSmokesDataType[]>(
    sortList(smokesData.roundSmokesData, "agents", isAsc.roundSmokes),
  );
  // const [wallSmokesList, setWallSmokesList] = useState<WallSmokesDataType[]>(
  //   sortList(smokesData.wallSmokesData, "agents", isAsc.wallSmokes),
  // );

  const handleClick = (
    table: string,
    column: keyof RoundSmokesDataType | keyof WallSmokesDataType,
  ) => {
    if (table === "roundSmokes") {
      if (sortedBy.roundSmokes === column) {
        setRoundSmokesList(
          sortList(
            roundSmokesList,
            column as keyof RoundSmokesDataType,
            !isAsc.roundSmokes,
          ),
        );
        setIsAsc({ ...isAsc, roundSmokes: !isAsc.roundSmokes });
      } else {
        setSortedBy({ ...sortedBy, roundSmokes: column });
        setIsAsc({ ...isAsc, roundSmokes: true });
        setRoundSmokesList(
          sortList(roundSmokesList, column as keyof RoundSmokesDataType, true),
        );
      }
    } else if (table === "wallSmokes") {
      if (sortedBy.wallSmokes === column) {
        setIsAsc({ ...isAsc, wallSmokes: !isAsc.wallSmokes });
      } else {
        setSortedBy({ ...sortedBy, wallSmokes: column });
        setIsAsc({ ...isAsc, wallSmokes: true });
      }
    }
  };

  return (
    <main>
      <div>
        <h1>Smokes</h1>
        <div>
          <h2>Round smokes</h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th>Smokes</th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => handleClick("roundSmokes", "agents")}
                >
                  Agent
                  <span
                    className={`ml-1 transition-colors duration-100 ${
                      sortedBy.roundSmokes === "agents"
                        ? "text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {sortedBy.roundSmokes === "agents"
                      ? isAsc.roundSmokes
                        ? "▲"
                        : "▼"
                      : "▲"}
                  </span>
                </th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => handleClick("roundSmokes", "duration")}
                >
                  Duration
                  <span
                    className={`ml-1 transition-colors duration-100 ${
                      sortedBy.roundSmokes === "duration"
                        ? "text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {sortedBy.roundSmokes === "duration"
                      ? isAsc.roundSmokes
                        ? "▲"
                        : "▼"
                      : "▲"}
                  </span>
                </th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => handleClick("roundSmokes", "radius")}
                >
                  Radius
                  <span
                    className={`ml-1 transition-colors duration-100 ${
                      sortedBy.roundSmokes === "radius"
                        ? "text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {sortedBy.roundSmokes === "radius"
                      ? isAsc.roundSmokes
                        ? "▲"
                        : "▼"
                      : "▲"}
                  </span>
                </th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => handleClick("roundSmokes", "cost")}
                >
                  Cost
                  <span
                    className={`ml-1 transition-colors duration-100 ${
                      sortedBy.roundSmokes === "cost"
                        ? "text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {sortedBy.roundSmokes === "cost"
                      ? isAsc.roundSmokes
                        ? "▲"
                        : "▼"
                      : "▲"}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {roundSmokesList.map((smokeObj) => (
                <tr className="text-center" key={smokeObj.id}>
                  <td className="flex justify-center">
                    <img
                      className="h-8 w-8 rounded-sm bg-gray-400 p-1"
                      src={smokeObj.imageUrl}
                      alt={`${smokeObj.agents}'s smoke`}
                    />
                  </td>
                  <td>{smokeObj.agents}</td>
                  <td>{smokeObj.duration}</td>
                  <td>{smokeObj.radius}</td>
                  <td>{smokeObj.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div>
          <h2>Wall smokes</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Agent</th>
                  <th>Duration (s)</th>
                  <th>Length (m)</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {sortedWallSmokes.map((smokeObj) => (
                  <tr className="text-center" key={smokeObj.id}>
                    <td className="flex justify-center">
                      <img
                        className="w-8 h-8 bg-gray-400 p-1 rounded-sm "
                        src={smokeObj.imageUrl}
                        alt={`${smokeObj.agents}'s smoke`}
                      />
                    </td>
                    <td>{smokeObj.agents}</td>
                    <td>{smokeObj.duration}</td>
                    <td>{smokeObj.length}</td>
                    <td>{smokeObj.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default SmokesPage;
