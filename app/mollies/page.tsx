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
import { Tooltip, User } from "@nextui-org/react";

import molliesData from "@/public/data/molliesData.json";
import { title } from "@/components/primitives";

export default function MolliesPage() {
  const mollyColumns = [
    { name: "Agent", sortable: true },
    { name: "Ability", sortable: true },
    { name: "Damage", sortable: false },
    { name: "Duration", sortable: true },
    { name: "Charge", sortable: true },
    { name: "Cost", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Mollies</h1>
      <div>
        <h2 className="mt-6">All mollies</h2>
        <Table className="mt-4" fullWidth={true}>
          <TableHeader>
            {mollyColumns.map((column) => (
              <TableColumn key={column.name}>
                {column.name.replace(/_/g, " ")}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {molliesData.molliesData.map((molly) => (
              <TableRow key={molly.id}>
                <TableCell>
                  <div className="flex w-max items-center">
                    <User
                      avatarProps={{ src: molly.agent_icon_url }}
                      className="gap-4"
                      name={molly.agent}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip content={molly.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={molly.name}
                        height={24}
                        src={molly.ability_icon_url}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{`${molly.damage.min !== null ? `${molly.damage.min} - ` : ""} ${molly.damage.max}`}</TableCell>
                <TableCell>{molly.duration}</TableCell>
                <TableCell>{molly.charge}</TableCell>
                <TableCell>{molly.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
