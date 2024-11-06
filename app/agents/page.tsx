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
import Link from "next/link";
import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

import agentsData from "@/public/data/agentData.json";
import { title } from "@/components/primitives";

export default function SmokePage() {
  const [isByRole, setIsByRole] = useState<boolean>(false);

  const agentsColumns = [
    { name: "Agent", sortable: true },
    { name: "Role", sortable: true },
    { name: "C", sortable: true },
    { name: "Q", sortable: true },
    { name: "E", sortable: true },
    { name: "X", sortable: true },
  ];

  const rolesList = ["Duelist", "Controller", "Initiator", "Sentinel"];

  return (
    <section>
      <div className="mt-6 flex justify-between">
        <h1 className={title()}>Agents</h1>
        <Checkbox
          isSelected={isByRole}
          onChange={(event) => setIsByRole(event.target.checked)}
        >
          Sort by role
        </Checkbox>
      </div>
      <div>
        {isByRole ? (
          rolesList.map((role, i) => (
            <div key={i}>
              <h2 className="mt-6">{role}</h2>
              <Table className="mt-4" fullWidth={true}>
                <TableHeader>
                  {agentsColumns.map((column) => (
                    <TableColumn key={column.name}>
                      {column.name.replace(/_/g, " ")}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {agentsData.agentsData
                    .filter((agentObj) => agentObj.role === role)
                    .map((agentObj) => (
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
                        <TableCell>
                          <div className="flex w-max items-center gap-4">
                            <Image
                              unoptimized
                              alt={agentObj.c_ability.name}
                              height={32}
                              src={agentObj.c_ability.ability_icon_url}
                              width={32}
                            />
                            <span>{agentObj.c_ability.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex w-max items-center gap-4">
                            <Image
                              unoptimized
                              alt={agentObj.q_ability.name}
                              height={32}
                              src={agentObj.q_ability.ability_icon_url}
                              width={32}
                            />
                            <span>{agentObj.q_ability.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex w-max items-center gap-4">
                            <Image
                              unoptimized
                              alt={agentObj.e_ability.name}
                              height={32}
                              src={agentObj.e_ability.ability_icon_url}
                              width={32}
                            />
                            <span>{agentObj.e_ability.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex w-max items-center gap-4">
                            <Image
                              unoptimized
                              alt={agentObj.x_ability.name}
                              height={32}
                              src={agentObj.x_ability.ability_icon_url}
                              width={32}
                            />
                            <span>{agentObj.x_ability.name}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ))
        ) : (
          <>
            <h2 className="mt-6">All Agents</h2>
            <Table className="mt-4" fullWidth={true} selectionMode="single">
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
                    <TableCell>
                      <div className="flex w-max items-center gap-4">
                        <Image
                          unoptimized
                          alt={agentObj.c_ability.name}
                          height={32}
                          src={agentObj.c_ability.ability_icon_url}
                          width={32}
                        />
                        <span>{agentObj.c_ability.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex w-max items-center gap-4">
                        <Image
                          unoptimized
                          alt={agentObj.q_ability.name}
                          height={32}
                          src={agentObj.q_ability.ability_icon_url}
                          width={32}
                        />
                        <span>{agentObj.q_ability.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex w-max items-center gap-4">
                        <Image
                          unoptimized
                          alt={agentObj.e_ability.name}
                          height={32}
                          src={agentObj.e_ability.ability_icon_url}
                          width={32}
                        />
                        <span>{agentObj.e_ability.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex w-max items-center gap-4">
                        <Image
                          unoptimized
                          alt={agentObj.x_ability.name}
                          height={32}
                          src={agentObj.x_ability.ability_icon_url}
                          width={32}
                        />
                        <span>{agentObj.x_ability.name}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </section>
  );
}
