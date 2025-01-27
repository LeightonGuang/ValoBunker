"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@heroui/table";
import { useEffect, useState } from "react";
import {
  User,
  Avatar,
  Button,
  Tooltip,
  Dropdown,
  Breadcrumbs,
  DropdownItem,
  DropdownMenu,
  useDisclosure,
  BreadcrumbItem,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { EllipsisIcon } from "@/components/icons";
import { getSupabase } from "@/utils/supabase/client";
import { AgentsTableType } from "@/types/AgentsTableType";
import { findObjectByKeyBind } from "@/utils/findObjectByKeyBind";

const columns = [
  { name: "Agent", sortable: true },
  { name: "Role", sortable: true },
  { name: "C", sortable: true },
  { name: "Q", sortable: true },
  { name: "E", sortable: true },
  { name: "X", sortable: true },
  { name: "Actions", sortable: false },
];

const ManageAgentsPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<AgentsTableType[]>([]);

  const fetchAllAgents = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("agents")
        .select(`*, abilities(*),roles(*)`)
        .order("name", { ascending: true });

      if (error) throw error;

      setAgents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAgents();
  }, []);

  return (
    <section className="w-full lg:mr-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>Agents</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className={title()}>Manage Agents</h1>

      <div className="mt-6 w-full">
        <Table aria-label="Manage Agents" selectionMode="single">
          <TableHeader>
            {columns.map((column, i) => (
              <TableColumn key={i}>{column.name}</TableColumn>
            ))}
          </TableHeader>

          <TableBody isLoading={isLoading}>
            {agents.map((agent) => {
              return (
                <TableRow key={agent.id}>
                  <TableCell>
                    <User
                      avatarProps={{ src: agent.icon_url }}
                      name={agent.name}
                    />
                  </TableCell>

                  <TableCell>
                    <Tooltip content={agent.roles.name}>
                      <Avatar className="h-6 w-6" src={agent.roles.icon_url} />
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <User
                      avatarProps={{
                        src: findObjectByKeyBind(agent.abilities, "C")
                          ?.icon_url,
                        classNames: {
                          base: "bg-transparent w-6 h-6",
                        },
                      }}
                      name={
                        <span className="whitespace-nowrap">
                          {findObjectByKeyBind(agent.abilities, "C")?.name}
                        </span>
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <User
                      avatarProps={{
                        src: findObjectByKeyBind(agent.abilities, "Q")
                          ?.icon_url,
                        classNames: {
                          base: "bg-transparent w-6 h-6",
                        },
                      }}
                      name={
                        <span className="whitespace-nowrap">
                          {findObjectByKeyBind(agent.abilities, "Q")?.name}
                        </span>
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <User
                      avatarProps={{
                        src: findObjectByKeyBind(agent.abilities, "E")
                          ?.icon_url,
                        classNames: {
                          base: "bg-transparent w-6 h-6",
                        },
                      }}
                      name={
                        <span className="whitespace-nowrap">
                          {findObjectByKeyBind(agent.abilities, "E")?.name}
                        </span>
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <User
                      avatarProps={{
                        src: findObjectByKeyBind(agent.abilities, "X")
                          ?.icon_url,
                        classNames: {
                          base: "bg-transparent w-6 h-6",
                        },
                      }}
                      name={
                        <span className="whitespace-nowrap">
                          {findObjectByKeyBind(agent.abilities, "X")?.name}
                        </span>
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light">
                          <EllipsisIcon />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit"
                          onPress={() =>
                            router.push(
                              `/moderator/manage/agents/edit/${agent.id}`,
                            )
                          }
                        >
                          Edit
                        </DropdownItem>

                        <DropdownItem
                          key="delete"
                          onPress={() => {
                            onOpen();
                            // setEventToDelete(agent);
                          }}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ManageAgentsPage;
