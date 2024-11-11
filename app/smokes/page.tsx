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

import smokesData from "@/public/data/smokesData.json";
import { title } from "@/components/primitives";

export default function SmokesPage() {
  const circularSmokesColumns = [
    { name: "agent", sortable: true },
    { name: "ability", sortable: false },
    { name: "duration", sortable: true },
    { name: "radius", sortable: true },
    { name: "cost", sortable: true },
    { name: "regen", sortable: true },
  ];
  const wallSmokesColumns = [
    { name: "agent", sortable: true },
    { name: "ability", sortable: false },
    { name: "duration", sortable: true },
    { name: "length", sortable: true },
    { name: "cost", sortable: true },
    { name: "regen", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Smokes</h1>
      <div>
        <h2 className="mt-6">Circular Smokes</h2>
        <Table className="mt-4" fullWidth={true}>
          <TableHeader>
            {circularSmokesColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {smokesData.circularSmokesData.map((smoke) => (
              <TableRow key={smoke.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: smoke.agent.agent_icon_url }}
                    name={smoke.agent.name}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={smoke.ability.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={smoke.ability.name}
                        height={24}
                        src={smoke.ability.iconUrl}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{smoke.duration}</TableCell>
                <TableCell>{smoke.radius}</TableCell>
                <TableCell>{smoke.cost}</TableCell>
                <TableCell>
                  {smoke.regen.reusable ? smoke.regen.regenTime : "x"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6">
        <h2 className="mt-6">Wall Smokes</h2>
        <Table className="mt-4">
          <TableHeader>
            {wallSmokesColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {smokesData.wallSmokesData.map((smoke) => (
              <TableRow key={smoke.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: smoke.agent.agent_icon_url }}
                    name={smoke.agent.name}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={smoke.ability.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={smoke.ability.name}
                        height={24}
                        src={smoke.ability.iconUrl}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{smoke.duration}</TableCell>
                <TableCell>{smoke.length}</TableCell>
                <TableCell>{smoke.cost}</TableCell>
                <TableCell>
                  {smoke.regen.reusable ? smoke.regen.regenTime : "x"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
