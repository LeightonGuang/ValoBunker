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
import { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardHeader, CardBody, User } from "@nextui-org/react";

import agentsData from "@/public/data/agentData.json";
import { title } from "@/components/primitives";
import { ListIcon } from "@/components/icons";
import { getSupabase } from "@/utils/supabase/client";
import { AgentsTableType } from "@/types/AgentsTableType";

const allAgentsColumns: { name: string; sortable: boolean }[] = [
  { name: "Agent", sortable: true },
  { name: "Role", sortable: true },
  { name: "C", sortable: true },
  { name: "Q", sortable: true },
  { name: "E", sortable: true },
  { name: "X", sortable: true },
];

const sortedAgentsColumns: { name: string; sortable: boolean }[] = [
  { name: "Agent", sortable: true },
  { name: "C", sortable: true },
  { name: "Q", sortable: true },
  { name: "E", sortable: true },
  { name: "X", sortable: true },
];

const rolesList: {
  role: string;
  role_icon_url: string;
  description: string;
}[] = [
  {
    role: "Duelist",
    role_icon_url:
      "https://static.wikia.nocookie.net/valorant/images/f/fd/DuelistClassSymbol.png",
    description: "Primary attackers. Gives the enemy a mouthful of knuckles.",
  },
  {
    role: "Initiator",
    role_icon_url:
      "https://static.wikia.nocookie.net/valorant/images/7/77/InitiatorClassSymbol.png",
    description:
      "Teams rely on these disruptors to break open sites and start a push",
  },
  {
    role: "Sentinel",
    role_icon_url:
      "https://static.wikia.nocookie.net/valorant/images/4/43/SentinelClassSymbol.png",
    description: "Reinforce held territory to finish the job.",
  },
  {
    role: "Controller",
    role_icon_url:
      "https://static.wikia.nocookie.net/valorant/images/0/04/ControllerClassSymbol.png",
    description: "Shape the battlefield to fit the team's plans",
  },
];

export default function AgentsPage() {
  const [agentsDataList, setAgentsDataList] = useState<AgentsTableType[]>([]);
  const getAllAgents = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("agents")
        .select(`*, abilities(*),roles(*)`)
        .eq("name", "Brimstone");

      if (error) {
        console.error(error);
      } else {
        setAgentsDataList([data[0]]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAgents();
  }, []);

  return (
    <section>
      <div className="flex justify-between">
        <h1 className={title()}>Agents</h1>
      </div>
      <div>
        <Tabs
          aria-label="Agents tabs"
          className="mt-4 flex justify-end"
          size="sm"
        >
          <Tab key={"allAgents"} aria-label="All Agents" title="All Agents">
            <Table aria-label="All Agents" className="mt-4" fullWidth={true}>
              <TableHeader>
                {allAgentsColumns.map((column) => (
                  <TableColumn key={column.name}>
                    {column.name.replace(/_/g, " ")}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {agentsDataList.map((agentObj) => {
                  const { roles, abilities } = agentObj;

                  return (
                    <TableRow key={agentObj.id}>
                      <TableCell>
                        <div className="flex w-max items-center">
                          <User
                            avatarProps={{ src: agentObj.icon_url }}
                            className="gap-4"
                            name={agentObj.name}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-max items-center gap-4">
                          <Image
                            unoptimized
                            alt={roles?.name}
                            height={24}
                            src={roles?.icon_url}
                            width={24}
                          />
                          <span>{roles?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-max items-center gap-4">
                          <Image
                            unoptimized
                            alt={
                              abilities?.filter((a) => a.key_bind === "C")[0]
                                .name
                            }
                            height={24}
                            src={
                              abilities?.filter((a) => a.key_bind === "C")[0]
                                .icon_url
                            }
                            width={24}
                          />
                          <span>
                            {
                              abilities?.filter((a) => a.key_bind === "C")[0]
                                .name
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-max items-center gap-4">
                          <Image
                            unoptimized
                            alt={
                              abilities?.filter((a) => a.key_bind === "Q")[0]
                                .name
                            }
                            height={24}
                            src={
                              abilities?.filter((a) => a.key_bind === "Q")[0]
                                .icon_url
                            }
                            width={24}
                          />
                          <span>
                            {
                              abilities?.filter((a) => a.key_bind === "Q")[0]
                                .name
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-max items-center gap-4">
                          <Image
                            unoptimized
                            alt={
                              abilities?.filter((a) => a.key_bind === "E")[0]
                                .name
                            }
                            height={24}
                            src={
                              abilities?.filter((a) => a.key_bind === "E")[0]
                                .icon_url
                            }
                            width={24}
                          />
                          <span>
                            {
                              abilities?.filter((a) => a.key_bind === "E")[0]
                                .name
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-max items-center gap-4">
                          <Image
                            unoptimized
                            alt={
                              abilities?.filter((a) => a.key_bind === "X")[0]
                                .name
                            }
                            height={24}
                            src={
                              abilities?.filter((a) => a.key_bind === "X")[0]
                                .icon_url
                            }
                            width={24}
                          />
                          <span>
                            {
                              abilities?.filter((a) => a.key_bind === "X")[0]
                                .name
                            }
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Tab>
          <Tab
            key={"sortByRoles"}
            aria-label="Sort by Roles"
            className="flex flex-col gap-10"
            title="Sort by Roles"
          >
            <Card aria-label="Contents" className="w-min">
              <CardHeader>
                Contents <ListIcon className="ml-2 h-4 w-4" />
              </CardHeader>
              <CardBody>
                <ul className="list-decimal text-sm text-[#aaaaaa] marker:text-sm marker:text-[#aaaaaa]">
                  {rolesList.map((roleObj, i) => (
                    <li key={i} className="w-max">
                      <Link
                        className="hover:underline"
                        href={`#agentsPage__${roleObj.role}`}
                      >
                        {roleObj.role}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            {rolesList.map((roleObj, i) => (
              <div key={i} id={`agentsPage__` + roleObj.role}>
                <h2>
                  <div className="flex items-center gap-4">
                    <Image
                      unoptimized
                      alt={roleObj.role}
                      height={24}
                      src={roleObj.role_icon_url}
                      width={24}
                    />
                    {roleObj.role}
                  </div>
                  <p className="mt-3 text-sm text-[#eeeeee]">
                    {roleObj.description}
                  </p>
                </h2>
                <Table className="mt-4" fullWidth={true}>
                  <TableHeader>
                    {sortedAgentsColumns.map((column) => (
                      <TableColumn key={column.name}>
                        {column.name.replace(/_/g, " ")}
                      </TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {agentsData.agentsData
                      .filter((agentObj) => agentObj.role === roleObj.role)
                      .map((agentObj) => (
                        <TableRow key={agentObj.id}>
                          <TableCell>
                            <div className="flex w-max items-center">
                              <Link
                                href={`/agents/${agentObj.name.toLowerCase()}`}
                              >
                                <User
                                  avatarProps={{ src: agentObj.agent_icon_url }}
                                  className="gap-4"
                                  name={agentObj.name}
                                />
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex w-max items-center gap-4">
                              <Image
                                unoptimized
                                alt={agentObj.c_ability.name}
                                height={24}
                                src={agentObj.c_ability.ability_icon_url}
                                width={24}
                              />
                              <span>{agentObj.c_ability.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex w-max items-center gap-4">
                              <Image
                                unoptimized
                                alt={agentObj.q_ability.name}
                                height={24}
                                src={agentObj.q_ability.ability_icon_url}
                                width={24}
                              />
                              <span>{agentObj.q_ability.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex w-max items-center gap-4">
                              <Image
                                unoptimized
                                alt={agentObj.e_ability.name}
                                height={24}
                                src={agentObj.e_ability.ability_icon_url}
                                width={24}
                              />
                              <span>{agentObj.e_ability.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex w-max items-center gap-4">
                              <Image
                                unoptimized
                                alt={agentObj.x_ability.name}
                                height={24}
                                src={agentObj.x_ability.ability_icon_url}
                                width={24}
                              />
                              <span>{agentObj.x_ability.name}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}
