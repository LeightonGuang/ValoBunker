"use client";

import blindData from "@/../../public/data/blindData.json";
import MainLayout from "@/components/MainLayout";
import TableComponent from "@/components/TableComponent";

const FlashPage = () => {
  return (
    <MainLayout>
      <div className="mx-4 py-4">
        <h1>Blind Abilities</h1>

        <div>
          <TableComponent
            tableName="Flash"
            columnNameObjList={[
              { name: "agent", sortable: true },
              { name: "ability", sortable: false },
              { name: "blind_duration", sortable: true },
              { name: "charge", sortable: true },
              { name: "cost", sortable: true },
              { name: "regen", sortable: true },
              { name: "health", sortable: true },
            ]}
            dataList={blindData.flashData}
          />
        </div>
        <div className="mt-8">
          <TableComponent
            tableName="Nearsight"
            columnNameObjList={[
              { name: "agent", sortable: true },
              { name: "ability", sortable: false },
              { name: "blind_duration", sortable: true },
              { name: "charge", sortable: true },
              { name: "cost", sortable: true },
              { name: "regen", sortable: true },
              { name: "health", sortable: true },
            ]}
            dataList={blindData.nearsigntData}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default FlashPage;
