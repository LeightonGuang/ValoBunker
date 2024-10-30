"use client";

import { useEffect, useMemo, useState } from "react";
import * as smokesData from "../../../../public/data/smokesData.json";

const smokesPage = () => {
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

  const sortList = (list: any, column: string, isAsc: boolean) => {
    const sorted = [...list].sort((a: any, b: any) =>
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
        : 0
    );

    return sorted;
  };

  const [roundSmokesList, setRoundSmokesList] = useState(
    sortList(smokesData.roundSmokesData, "agents", isAsc.roundSmokes)
  );
  const [wallSmokesList, sortedWallSmokesList] = useState(
    sortList(smokesData.wallSmokesData, "agents", isAsc.wallSmokes)
  );

  const handleClick = (table: string, column: string) => {
    if (table === "roundSmokes") {
      if (sortedBy.roundSmokes === column) {
        setRoundSmokesList(
          sortList(roundSmokesList, column, !isAsc.roundSmokes)
        );
        setIsAsc({ ...isAsc, roundSmokes: !isAsc.roundSmokes });
      } else {
        setSortedBy({ ...sortedBy, roundSmokes: column });
        setIsAsc({ ...isAsc, roundSmokes: true });
        setRoundSmokesList(sortList(roundSmokesList, column, true));
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
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Smokes</th>
                <th onClick={() => handleClick("roundSmokes", "agents")}>
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
                      : ""}
                  </span>
                </th>
                <th onClick={() => handleClick("roundSmokes", "duration")}>
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
                      : ""}
                  </span>
                </th>
                <th onClick={() => handleClick("roundSmokes", "radius")}>
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
                      : ""}
                  </span>
                </th>
                <th onClick={() => handleClick("roundSmokes", "cost")}>
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
                      : ""}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {roundSmokesList.map((smokeObj) => (
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

export default smokesPage;
