"use client";

import { useState } from "react";
import smokesDataJson from "../../../../public/data/smokesData.json";
const smokesData = smokesDataJson as SmokesData;

interface RoundSmokesDataType {
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

interface WallSmokesDataType {
  id: number;
  imageUrl: string;
  agents: string;
  abilityName: string;
  duration: number;
  length?: number | string;
  cost: number;
  regen: {
    reusable: boolean;
    regenTime: number | null;
  };
}

interface SmokesData {
  roundSmokesData: RoundSmokesDataType[];
  wallSmokesData: WallSmokesDataType[];
}

type CommonKeys = keyof (RoundSmokesDataType & WallSmokesDataType);

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

  const sortList = (
    list: (RoundSmokesDataType | WallSmokesDataType)[],
    column: CommonKeys,
    isAsc: boolean,
  ) => {
    const sorted = [...list].sort((a, b) => {
      // Define a fallback value to handle missing properties
      const aValue = column in a ? a[column as keyof typeof a] : 0;
      const bValue = column in b ? b[column as keyof typeof b] : 0;

      return isAsc ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1;
    });

    return sorted;
  };

  const [roundSmokesList, setRoundSmokesList] = useState<RoundSmokesDataType[]>(
    sortList(smokesData.roundSmokesData, "agents", isAsc.roundSmokes),
  );
  const [wallSmokesList, setWallSmokesList] = useState<WallSmokesDataType[]>(
    sortList(smokesData.wallSmokesData, "agents", isAsc.wallSmokes),
  );

  const handleClick = (
    table: string,
    column: keyof RoundSmokesDataType | keyof WallSmokesDataType,
  ) => {
    if (table === "roundSmokes") {
      if (sortedBy.roundSmokes === column) {
        setRoundSmokesList(
          sortList(roundSmokesList, column, !isAsc.roundSmokes),
        );
        setIsAsc({ ...isAsc, roundSmokes: !isAsc.roundSmokes });
      } else {
        setSortedBy({ ...sortedBy, roundSmokes: column });
        setIsAsc({ ...isAsc, roundSmokes: true });
        setRoundSmokesList(sortList(roundSmokesList, column, true));
      }
    } else if (table === "wallSmokes") {
      if (sortedBy.wallSmokes === column) {
        setWallSmokesList(sortList(wallSmokesList, column, !isAsc.wallSmokes));
        setIsAsc({ ...isAsc, wallSmokes: !isAsc.wallSmokes });
      } else {
        setSortedBy({ ...sortedBy, wallSmokes: column });
        setWallSmokesList(
          sortList(wallSmokesList, column as keyof WallSmokesDataType, true),
        );
        setIsAsc({ ...isAsc, wallSmokes: true });
      }
    }
  };

  return (
    <main>
      <div>
        <h1>Smokes</h1>
        <div id="round_smokes-container">
          <h2>Round smokes</h2>
          <table className="w-full table-auto" id="round-smokes-table">
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
        <div id="wall_smokes-container">
          <h2>Wall smokes</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th>Image</th>
                  <th
                    className="cursor-pointer select-none"
                    onClick={() => handleClick("wallSmokes", "agents")}
                  >
                    Agent
                    <span
                      className={`ml-1 transition-colors duration-100 ${
                        sortedBy.wallSmokes === "agents"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {sortedBy.wallSmokes === "agents"
                        ? isAsc.wallSmokes
                          ? "▲"
                          : "▼"
                        : "▲"}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer select-none"
                    onClick={() => handleClick("wallSmokes", "duration")}
                  >
                    Duration (s)
                    <span
                      className={`ml-1 transition-colors duration-100 ${
                        sortedBy.wallSmokes === "duration"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {sortedBy.wallSmokes === "duration"
                        ? isAsc.wallSmokes
                          ? "▲"
                          : "▼"
                        : "▲"}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer select-none"
                    onClick={() => handleClick("wallSmokes", "length")}
                  >
                    Length
                    <span
                      className={`ml-1 transition-colors duration-100 ${
                        sortedBy.wallSmokes === "length"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {sortedBy.wallSmokes === "length"
                        ? isAsc.wallSmokes
                          ? "▲"
                          : "▼"
                        : "▲"}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer select-none"
                    onClick={() => handleClick("wallSmokes", "cost")}
                  >
                    Cost
                    <span
                      className={`ml-1 transition-colors duration-100 ${
                        sortedBy.wallSmokes === "cost"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {sortedBy.wallSmokes === "cost"
                        ? isAsc.wallSmokes
                          ? "▲"
                          : "▼"
                        : "▲"}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {wallSmokesList.map((smokeObj) => (
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
                    <td>{smokeObj.length}</td>
                    <td>{smokeObj.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SmokesPage;
