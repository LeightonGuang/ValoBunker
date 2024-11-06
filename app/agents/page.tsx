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

import agentsData from "@/public/data/agentData.json";
import { title } from "@/components/primitives";

import { Tooltip } from "@nextui-org/tooltip";
import Link from "next/link";

export default function SmokePage() {
  const agentsColumns = [
    { name: "Name", sortable: true },
    { name: "Role", sortable: true },
    { name: "C", sortable: true },
    { name: "Q", sortable: true },
    { name: "E", sortable: true },
    { name: "X", sortable: true },
  ];

  return (
    <section>
      <h1 className={title()}>Smokes</h1>
      <div>
        <h2 className="mt-6">Circular Smokes</h2>
        <Table className="mt-4" fullWidth={true}>
          <TableHeader>
            {agentsColumns.map((column) => (
              <TableColumn key={column.name}>
                {column.name.replace(/_/g, " ")}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {agentsData.agentsData.map((agentObj) => (
              <TableRow key={agentObj.id}>
                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Image
                      unoptimized
                      alt={agentObj.name}
                      height={32}
                      src={agentObj.agent_icon_url}
                      width={32}
                    />
                    <div>
                      <Link
                        className="hover:underline"
                        href={`/agents/${agentObj.name.toLowerCase()}`}
                      >
                        {agentObj.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Image
                      unoptimized
                      alt={agentObj.role}
                      height={32}
                      src={agentObj.role_icon_url}
                      width={32}
                    />
                    <span>{agentObj.role}</span>
                  </div>
                </TableCell>
                <TableCell>{agentObj.c_ability.name}</TableCell>
                <TableCell>{agentObj.q_ability.name}</TableCell>
                <TableCell>{agentObj.e_ability.name}</TableCell>
                <TableCell>{agentObj.x_ability.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
