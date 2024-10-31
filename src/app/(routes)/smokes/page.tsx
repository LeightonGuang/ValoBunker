"use client";

import smokesData from "@/../../public/data/smokesData.json";
import TableComponent from "@/components/TableComponent";

const SmokesPage = () => {
  return (
    <main>
      <div className="m-4">
        <h1>Smokes</h1>

        <div id="round_smokes-container">
          <TableComponent
            tableName="Round smokes"
            columnNameObjList={[
              { name: "imageUrl", sortable: false },
              { name: "agent", sortable: true },
              { name: "duration", sortable: true },
              { name: "radius", sortable: true },
              { name: "cost", sortable: true },
            ]}
            dataList={smokesData.roundSmokesData}
          />
        </div>
        <div className="mt-8" id="wall_smokes-container">
          <TableComponent
            tableName="Wall smokes"
            columnNameObjList={[
              { name: "imageUrl", sortable: false },
              { name: "agent", sortable: true },
              { name: "duration", sortable: true },
              { name: "length", sortable: true },
              { name: "cost", sortable: true },
            ]}
            dataList={smokesData.wallSmokesData}
          />
        </div>
      </div>
    </main>
  );
};

export default SmokesPage;
