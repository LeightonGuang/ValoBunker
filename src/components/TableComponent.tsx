import Image from "next/image";
import { useState } from "react";

interface Props<T extends { id: number; [key: string]: unknown }> {
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

  const [sortedBy, setSortedBy] = useState<string | null>(
    Object.keys(dataList[0])[2],
  );
  const [isAscendingOrder, setIsAscendingOrder] = useState<boolean>(true);
  const [sortedDataList, setSortedDataList] = useState(
    sortList(dataList, sortedBy!, isAscendingOrder),
  );

  const handleClickSort = (columnName: string) => {
    if (sortedBy === columnName) {
      setSortedDataList(
        sortList(sortedDataList, columnName as keyof T, !isAscendingOrder),
      );
      setIsAscendingOrder(!isAscendingOrder);
    } else {
      setSortedBy(columnName);
      setIsAscendingOrder(true);
      setSortedDataList(sortList(dataList, columnName as keyof T, true));
    }
  };

  const renderCellContent = (columnName: string, value: unknown) => {
    switch (columnName) {
      case "imgUrl": {
        const imgUrl = value as string;
        return (
          <Image
            className="sm:w-20"
            src={imgUrl}
            alt="Image"
            width={48}
            height={27}
            loader={() => imgUrl}
          />
        );
      }
      case "ability": {
        const ability = value as { name: string; iconUrl: string };
        return (
          <Image
            className="min-h-8 min-w-8 rounded-sm bg-gray-400 p-1"
            src={ability.iconUrl}
            alt={ability.name}
            width={32}
            height={32}
            loader={() => ability.iconUrl}
          />
        );
      }
      case "regen": {
        const regen = value as { reusable: boolean; regenTime: number | null };
        return regen.reusable ? `${regen.regenTime} s` : "x";
      }
      case "fire_rate": {
        if (value) {
          const fire_rate = value as { primary: number; alt: number };
          return (
            fire_rate.primary + (fire_rate.alt ? ` / ${fire_rate.alt}` : "")
          );
        } else {
          return "-";
        }
      }
      default: {
        return typeof value === "string" || typeof value === "number"
          ? value
          : "-";
      }
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
                key={i}
                className={`text-left font-bold ${i > 4 ? "hidden sm:table-cell" : ""}`}
              >
                {columnObj.sortable ? (
                  <button onClick={() => handleClickSort(columnObj.name)}>
                    {columnObj.name.replace(/_/g, " ")}
                    <span
                      className={`ml-1 text-xs ${sortedBy === columnObj.name ? "text-white" : "text-gray-400"}`}
                    >
                      {sortedBy === columnObj.name
                        ? isAscendingOrder
                          ? "▲"
                          : "▼"
                        : "▲"}
                    </span>
                  </button>
                ) : (
                  columnObj.name
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDataList.map((dataObj) => (
            <tr
              key={dataObj.id}
              className="border-b border-gray-500 border-opacity-20"
            >
              {columnNameObjList.map((columnObj, j) => (
                <td
                  key={j}
                  className={`pr-4 text-left ${j > 4 ? "hidden sm:table-cell" : ""}`}
                >
                  {renderCellContent(columnObj.name, dataObj[columnObj.name])}
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
