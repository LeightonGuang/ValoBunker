"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

import weaponsData from "@/public/data/weaponData.json";
import { title } from "@/components/primitives";

export default function WeaponsPage() {
  const flashColumns = [
    { name: "Name", sortable: true },
    { name: "Type", sortable: false },
    { name: "Image", sortable: true },
    { name: "Cost", sortable: true },
    { name: "Range: Head / Body / Leg", sortable: true },
    { name: "fire_rate", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Weapons</h1>
      <div>
        <h2 className="mt-6">Weapons</h2>
        <Table className="mt-4" fullWidth={true}>
          <TableHeader>
            {flashColumns.map((column) => (
              <TableColumn key={column.name}>
                {column.name.replace(/_/g, " ")}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {weaponsData.weaponData.map((weapon) => (
              <TableRow key={weapon.id}>
                <TableCell>{weapon.name}</TableCell>
                <TableCell>{weapon.type}</TableCell>
                <TableCell>
                  <div className="cursor-pointer">
                    <Image
                      unoptimized
                      alt={weapon.name}
                      className="h-12 w-auto"
                      height={32}
                      src={weapon.img_url}
                      width={56.89}
                    />
                  </div>
                </TableCell>
                <TableCell>{weapon.cost}</TableCell>
                <TableCell>
                  <div className="flex w-min flex-col gap-1 whitespace-nowrap">
                    {weapon.damageList.map((damageObj: any, i) => (
                      <div key={i}>
                        <span className="font-bold">{`${damageObj.range}: `}</span>
                        <span>
                          {Object.keys(damageObj.damage).map((key, j) => (
                            <span key={j}>
                              {`${damageObj.damage[key]}${
                                j < Object.keys(damageObj.damage).length - 1
                                  ? " / "
                                  : ""
                              }`}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {`${weapon.fire_rate?.primary ? weapon.fire_rate?.primary : "x"} 
                / 
                ${weapon.fire_rate?.alt ? weapon.fire_rate?.alt : "x"}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
