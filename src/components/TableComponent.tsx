import { useState } from "react";

interface Props<
  T extends { id: number; [key: string]: string | number | unknown },
> {
  tableName: string;
  columnNameObjList: { name: string; sortable: boolean }[];
  dataList: T[];
}

type TableRow = { id: number } & { [key: string]: unknown };

const TableComponent = <T extends TableRow>({
  tableName,
  columnNameObjList,
  dataList,
}: Props<T>) => {
  const [sortedBy, setSortedBy] = useState<string | null>(
    Object.keys(dataList[0])[2],
  );
  const [isAscendingOrder, setIsAscendingOrder] = useState<boolean>(true);

  const sortList = <T, K extends keyof T>(
    list: T[],
    column: K,
    isAsc: boolean,
  ) => {
    return [...list].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      return aValue < bValue
        ? isAsc
          ? -1
          : 1
        : aValue > bValue
          ? isAsc
            ? 1
            : -1
          : 0;
    });
  };

  const [sortedDataList, setSortedDataList] = useState(
    sortList(dataList, Object.keys(dataList[0])[2], isAscendingOrder),
  );

  const handleClickSort = (columnName: string) => {
    if (sortedBy === columnName) {
      setSortedDataList(
        sortList(sortedDataList, columnName, !isAscendingOrder),
      );
      setIsAscendingOrder(!isAscendingOrder);
    } else if (sortedBy !== columnName) {
      setSortedBy(columnName);
      setIsAscendingOrder(true);
      setSortedDataList(sortList(sortedDataList, columnName, true));
    }
  };

  return (
    <>
      <h2>{tableName}</h2>
      <table className="w-full table-auto border-white">
        <thead>
          <tr className="border-b-2 border-gray-500 border-opacity-20">
            {columnNameObjList.map((columnObj, i) => (
              <th
                className={`text-left font-bold ${i > 5 ? "hidden" : ""}`}
                key={i}
              >
                {columnObj.sortable ? (
                  <button onClick={() => handleClickSort(columnObj.name)}>
                    {columnObj.name}
                    <span
                      className={`ml-1 text-xs transition-colors duration-100 ${
                        sortedBy === columnObj.name
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {sortedBy === columnObj.name
                        ? isAscendingOrder
                          ? "▲"
                          : "▼"
                        : "▲"}
                    </span>
                  </button>
                ) : (
                  <>
                    {columnObj.name === "abilityIconUrl"
                      ? "icon"
                      : columnObj.name}
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDataList.map((dataObj) => (
            <tr
              className="border-b-2 border-gray-500 border-opacity-20"
              key={dataObj.id}
            >
              {Object.entries(dataObj).map(([key, value], j) => {
                if (
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "object"
                ) {
                  // Check if the key exists in columnNameObjList
                  if (columnNameObjList.some((column) => column.name === key)) {
                    if (key === "ability") {
                      const abilityValue = value as {
                        name: string;
                        iconUrl: string;
                      };
                      return (
                        <td key={j}>
                          <img
                            className="h-8 w-8 rounded-sm bg-gray-400 p-1"
                            src={abilityValue.iconUrl}
                            alt={abilityValue.name}
                          />
                        </td>
                      );
                    } else if (key === "duration") {
                      return <td key={j}>{String(value)} s</td>;
                    } else if (key === "length" || key === "radius") {
                      return <td key={j}>{`${value} m`}</td>;
                    } else if (key === "regen") {
                      const regenValue = value as {
                        reusable: boolean;
                        regenTime: number | null;
                      };
                      return (
                        <td key={j}>
                          {regenValue.reusable ? regenValue.regenTime : "x"}
                        </td>
                      );
                    } else if (key !== "id") {
                      return <td key={j}>{String(value)}</td>;
                    }
                  }
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableComponent;
