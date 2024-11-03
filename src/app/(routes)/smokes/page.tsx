"use client";

import smokesData from "@/../../public/data/smokesData.json";
import TableComponent from "@/components/TableComponent";

const SmokesPage = () => {
  return (
    <main>
      <div className="mx-4 py-4">
        <h1>Smokes</h1>

        <div id="round_smokes-container">
          <TableComponent
            tableName="Circular smokes"
            columnNameObjList={[
              { name: "agent", sortable: true },
              { name: "ability", sortable: false },
              { name: "duration", sortable: true },
              { name: "radius", sortable: true },
              { name: "cost", sortable: true },
              { name: "regen", sortable: true },
            ]}
            dataList={smokesData.circularSmokesData}
          />
        </div>
        <div className="mt-8" id="wall_smokes-container">
          <TableComponent
            tableName="Wall smokes"
            columnNameObjList={[
              { name: "agent", sortable: true },
              { name: "ability", sortable: false },
              { name: "duration", sortable: true },
              { name: "length", sortable: true },
              { name: "cost", sortable: true },
              { name: "regen", sortable: true },
            ]}
            dataList={smokesData.wallSmokesData}
          />
        </div>
      </div>
    </main>
  );
};

export default SmokesPage;
