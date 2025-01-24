"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Selection,
  TableColumn,
  TableHeader,
  SortDescriptor,
} from "@nextui-org/table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  Image,
  Button,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { ChevronDown } from "@/components/icons";
import { getSupabase } from "@/utils/supabase/client";
import { RolesTableType } from "@/types/RolesTableType";
import { AgentsTableType } from "@/types/AgentsTableType";

const allAgentsColumns = [
  { name: "Agent", sortBy: "name", sortable: true },
  { name: "Role", sortBy: "roles.name", sortable: true },
  { name: "C", sortable: false },
  { name: "Q", sortable: false },
  { name: "E", sortable: false },
  { name: "X", sortable: false },
];

export default function AgentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [agentsDataList, setAgentsDataList] = useState<AgentsTableType[]>([]);
  const [rolesDataList, setRolesDataList] = useState<RolesTableType[]>([]);
  const [roleFilter, setRoleFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select(`*, abilities(*), roles(*)`)
        .order("id", { ascending: true });

      if (agentError) {
        console.error(agentError);
      } else {
        setAgentsDataList(agentData as AgentsTableType[]);
      }

      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("*");

      if (roleError) {
        console.error(roleError);
      } else {
        setRolesDataList(roleData as RolesTableType[]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    let filteredAgents = [...agentsDataList];

    if (roleFilter !== "all") {
      const selectedRoles = Array.from(roleFilter).map(String);

      filteredAgents = filteredAgents.filter((agent) =>
        selectedRoles.includes(String(agent.roles.id)),
      );
    }

    return filteredAgents;
  }, [agentsDataList, roleFilter]);

  const sortedPlayers = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const getValue = (obj: any, path: string) => {
        return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);
      };

      const first = getValue(a, sortDescriptor.column as keyof AgentsTableType);

      const second = getValue(
        b,
        sortDescriptor.column as keyof AgentsTableType,
      );

      const normalizeValue = (value: any) => {
        return value ? String(value).toLowerCase() : "";
      };

      const normalizedFirst = normalizeValue(first);
      const normalizedSecond = normalizeValue(second);

      const result = normalizedFirst.localeCompare(normalizedSecond);

      return sortDescriptor.direction === "ascending" ? result : -result;
    });
  }, [filteredItems, sortDescriptor, agentsDataList]);

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between text-small text-default-400">
        <span>Total {sortedPlayers.length} agents</span>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<ChevronDown fill="currentColor" />}>
                Role
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              disallowEmptySelection
              aria-label="Role"
              closeOnSelect={false}
              selectedKeys={roleFilter}
              selectionMode="multiple"
              onSelectionChange={setRoleFilter}
            >
              {rolesDataList.map((role) => {
                return (
                  <DropdownItem key={role.id} textValue={String(role.id)}>
                    <User
                      avatarProps={{ src: role.icon_url, size: "sm" }}
                      name={role.name}
                    />
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [agentsDataList, rolesDataList, roleFilter]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <div className="flex justify-between">
        <h1 className={title()}>Agents</h1>
      </div>

      <Table
        aria-label="All Agents"
        className="mt-6"
        fullWidth={true}
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onRowAction={(key) => router.push(`/agents/${key}`)}
        onSortChange={onSortChange}
      >
        <TableHeader>
          {allAgentsColumns.map((column, i) => (
            <TableColumn
              key={column.sortBy ?? i}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody isLoading={isLoading} items={sortedPlayers}>
          {(agent) => {
            const { roles, abilities } = agent;

            return (
              <TableRow key={agent.name} className="cursor-pointer">
                <TableCell>
                  <div className="flex w-max items-center">
                    <User
                      avatarProps={{ src: agent.icon_url }}
                      className="gap-4"
                      name={agent.name}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Tooltip content={roles?.name}>
                      <Image
                        alt={roles?.name}
                        height={24}
                        src={roles.icon_url}
                        width={24}
                      />
                    </Tooltip>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Image
                      alt={
                        abilities?.filter((a) => a.key_bind === "C")[0]?.name ||
                        "-"
                      }
                      height={24}
                      src={
                        abilities?.filter((a) => a.key_bind === "C")[0]
                          ?.icon_url || "https://placehold.co/24"
                      }
                      width={24}
                    />
                    <span>
                      {abilities?.filter((a) => a.key_bind === "C")[0]?.name ||
                        "-"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Image
                      alt={
                        abilities?.filter((a) => a.key_bind === "Q")[0]?.name ||
                        "-"
                      }
                      height={24}
                      src={
                        abilities?.filter((a) => a.key_bind === "Q")[0]
                          ?.icon_url || "https://placehold.co/24"
                      }
                      width={24}
                    />
                    <span>
                      {abilities?.filter((a) => a.key_bind === "Q")[0]?.name ||
                        "-"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Image
                      alt={
                        abilities?.filter((a) => a.key_bind === "E")[0]?.name ||
                        "-"
                      }
                      height={24}
                      src={
                        abilities?.filter((a) => a.key_bind === "E")[0]
                          ?.icon_url || "https://placehold.co/24"
                      }
                      width={24}
                    />
                    <span>
                      {abilities?.filter((a) => a.key_bind === "E")[0]?.name ||
                        "-"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex w-max items-center gap-4">
                    <Image
                      alt={
                        abilities?.filter((a) => a.key_bind === "X")[0]?.name ||
                        "-"
                      }
                      height={24}
                      src={
                        abilities?.filter((a) => a.key_bind === "X")[0]
                          ?.icon_url || "https://placehold.co/24"
                      }
                      width={24}
                    />
                    <span>
                      {abilities?.filter((a) => a.key_bind === "X")[0]?.name ||
                        "-"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </section>
  );
}
