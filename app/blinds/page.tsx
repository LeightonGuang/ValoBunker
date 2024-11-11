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

import blindsData from "@/public/data/blindData.json";
import { title } from "@/components/primitives";

export default function SmokePage() {
  const flashColumns = [
    { name: "Agent", sortable: true },
    { name: "Ability", sortable: false },
    { name: "Blind Duration", sortable: true },
    { name: "Charge", sortable: true },
    { name: "Cost", sortable: true },
    { name: "Regen", sortable: true },
    { name: "Health", sortable: true },
  ];
  const nearsigntColumns = [
    { name: "Agent", sortable: true },
    { name: "Ability", sortable: false },
    { name: "Blind Duration", sortable: true },
    { name: "Charge", sortable: true },
    { name: "Cost", sortable: true },
    { name: "Regen", sortable: true },
    { name: "Health", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Blinds</h1>
      <div>
        <h2 className="mt-6">Flash</h2>
        <Table className="mt-4" fullWidth={true}>
          <TableHeader>
            {flashColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {blindsData.flashData.map((flash) => (
              <TableRow key={flash.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: flash.agent.agent_icon_url }}
                    name={flash.agent.name}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={flash.ability.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={flash.ability.name}
                        height={24}
                        src={flash.ability.iconUrl}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{flash.blind_duration}</TableCell>
                <TableCell>{flash.charge}</TableCell>
                <TableCell>{flash.cost}</TableCell>
                <TableCell>
                  {flash.regen.reusable ? flash.regen.regenTime : "x"}
                </TableCell>
                <TableCell>{flash.health ? flash.health : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6">
        <h2 className="mt-6">Nearsight</h2>
        <Table className="mt-4">
          <TableHeader>
            {nearsigntColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {blindsData.nearsigntData.map((nearsight) => (
              <TableRow key={nearsight.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: nearsight.agent.agent_icon_url }}
                    name={nearsight.agent.name}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={nearsight.ability.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={nearsight.ability.name}
                        height={24}
                        src={nearsight.ability.iconUrl}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{nearsight.blind_duration}</TableCell>
                <TableCell>{nearsight.charge}</TableCell>
                <TableCell>{nearsight.cost}</TableCell>
                <TableCell>
                  {nearsight.regen.reusable ? nearsight.regen.regenTime : "x"}
                </TableCell>
                <TableCell>
                  {nearsight.health ? nearsight.health : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
