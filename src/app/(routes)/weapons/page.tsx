"use client";

import TableComponent from "@/components/TableComponent";
import weaponData from "@/../../public/data/weaponData.json";
import MainLayout from "@/components/MainLayout";

const WeaponsPage = () => {
  return (
    <MainLayout>
      <div className="mx-4 py-4">
        <h1>Weapons</h1>

        <div>
          <TableComponent
            tableName="All Weapons"
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
    </MainLayout>
  );
};

export default WeaponsPage;
