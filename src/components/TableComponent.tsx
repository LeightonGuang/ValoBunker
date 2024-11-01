import Image from "next/image";
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

      if (typeof aValue === "number" && typeof bValue === "string") {
        return isAsc ? 1 : -1;
      } else if (typeof aValue === "string" && typeof bValue === "number") {
        return isAsc ? -1 : 1;
      }

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
                className={`text-left font-bold ${i > 4 && "hidden sm:table-cell"}`}
                key={i}
              >
                {columnObj.sortable ? (
                  <button onClick={() => handleClickSort(columnObj.name)}>
                    {columnObj.name.replace(/_/g, " ")}
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
                  if (value === null || !value) value = "x";
                  // Check if the key exists in columnNameObjList
                  if (columnNameObjList.some((column) => column.name === key)) {
                    return (
                      <td
                        className={`${j > 5 && "hidden sm:table-cell"}`}
                        key={j}
                      >
                        {key === "ability" ? (
                          <Image
                            width={32}
                            height={32}
                            loader={() =>
                              (
                                value as {
                                  name: string;
                                  iconUrl: string;
                                }
                              ).iconUrl
                            }
                            className="min-h-8 min-w-8 rounded-sm bg-gray-400 p-1"
                            src={
                              (
                                value as {
                                  name: string;
                                  iconUrl: string;
                                }
                              ).iconUrl
                            }
                            alt={
                              (value as { name: string; iconUrl: string }).name
                            }
                          />
                        ) : key === "duration" ? (
                          `${value} s`
                        ) : key === "length" || key === "radius" ? (
                          `${value} m`
                        ) : key === "regen" ? (
                          `${
                            (
                              value as {
                                reusable: boolean;
                                regenTime: number | null;
                              }
                            ).reusable
                              ? (
                                  value as {
                                    reusable: boolean;
                                    regenTime: number | null;
                                  }
                                ).regenTime
                              : "x"
                          }`
                        ) : key !== "id " ? (
                          `${value}`
                        ) : (
                          ""
                        )}
                      </td>
                    );
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
