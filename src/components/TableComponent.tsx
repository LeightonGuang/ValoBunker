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
          {sortedDataList.map((dataObj, i) => (
            <tr key={i} className="border-b border-gray-500 border-opacity-20">
              {columnNameObjList.map((columnObj, j) => (
                <td
                  className={`pr-4 text-left ${
                    j > 4 && "hidden sm:table-cell"
                  }`}
                  key={j}
                >
                  {columnObj.name === "ability" ? (
                    <Image
                      className="min-h-8 min-w-8 rounded-sm bg-gray-400 p-1"
                      width={32}
                      height={32}
                      loader={() =>
                        (
                          dataObj.ability as {
                            name: string;
                            iconUrl: string;
                          }
                        ).iconUrl
                      }
                      src={
                        (
                          dataObj.ability as {
                            name: string;
                            iconUrl: string;
                          }
                        ).iconUrl
                      }
                      alt={
                        (dataObj.ability as { name: string; iconUrl: string })
                          .name
                      }
                    />
                  ) : columnObj.name === "regen" ? (
                    `${
                      (
                        dataObj.ability as {
                          reusable: boolean;
                          regenTime: number | null;
                        }
                      ).reusable
                        ? (
                            dataObj.ability as {
                              reusable: boolean;
                              regenTime: number | null;
                            }
                          ).regenTime
                        : "x"
                    }`
                  ) : columnObj.name === "imgUrl" ? (
                    <Image
                      className="sm:w-20"
                      src={dataObj.imgUrl as string}
                      alt={dataObj.name as string}
                      width={48}
                      height={27}
                      loader={() => dataObj.imgUrl as string}
                    />
                  ) : (
                    (dataObj[columnObj.name] as string | number)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableComponent;
