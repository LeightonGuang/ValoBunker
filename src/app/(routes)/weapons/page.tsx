"use client";

import TableComponent from "@/components/TableComponent";
import weaponData from "@/../../public/data/weaponData.json";

const WeaponsPage = () => {
  return (
    <main>
      <div className="m-4">
        <h1>Weapons</h1>

        <div>
          <TableComponent
            tableName="Weapons"
            columnNameObjList={[
              { name: "name", sortable: true },
              { name: "imgUrl", sortable: false },
              { name: "type", sortable: true },
              { name: "cost", sortable: true },
              { name: "fire_rate", sortable: true },
            ]}
            dataList={weaponData.weaponData}
          />
        </div>
      </div>
    </main>
  );
};

export default WeaponsPage;
