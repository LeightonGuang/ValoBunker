import { RoundSmokesDataType } from "@/app/types/RoundSmokesDataType";
import { WallSmokesDataType } from "@/app/types/WallSmokesDataType";

interface Props<T> {
  columnNameObjList: { name: string; sortable: boolean }[];
  dataList: RoundSmokesDataType[] | WallSmokesDataType[] | T[];
}

type TableRow = { id: number } & { [key: string]: string | number };

const TableComponent = <T extends TableRow>({
  columnNameObjList,
  dataList,
}: Props<T>) => {
  return (
    <table className="w-full table-auto border-white">
      <thead>
        <tr className="border-b-2 border-gray-500 border-opacity-20">
          {columnNameObjList.map((columnObj, i) => (
            <th className="text-left font-bold" key={i}>
              {columnObj.name === "imageUrl" ? "image" : columnObj.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataList.map((dataObj) => (
          <tr
            className="border-b-2 border-gray-500 border-opacity-20"
            key={dataObj.id}
          >
            {Object.entries(dataObj).map(([key, value], j) => {
              // Check if the key exists in columnNameObjList
              if (columnNameObjList.some((column) => column.name === key)) {
                if (key === "imageUrl") {
                  return (
                    <td className="flex justify-center" key={j}>
                      <img
                        className="h-8 w-8 rounded-sm bg-gray-400 p-1"
                        src={`${value}`}
                        alt="ability icon"
                      />
                    </td>
                  );
                } else if (key === "duration") {
                  return <td key={j}>{value} s</td>;
                } else if (key === "length" || key === "radius") {
                  return <td key={j}>{value} m</td>;
                } else if (key !== "id") {
                  return <td key={j}>{value}</td>;
                }
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
