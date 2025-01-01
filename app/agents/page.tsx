"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@nextui-org/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image, Tooltip, User } from "@nextui-org/react";

import { title } from "@/components/primitives";
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

export default function AgentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [agentsDataList, setAgentsDataList] = useState<AgentsTableType[]>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("agents")
        .select(`*, abilities(*), roles(*)`)
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setAgentsDataList(data as AgentsTableType[]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const TopContent = () => {
    return (
      <div className="flex justify-between text-small text-default-400">
        <span>Total agents:{agentsDataList.length}</span>
        <div></div>
      </div>
    );
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
        topContent={<TopContent />}
        topContentPlacement="outside"
        onRowAction={(key) => router.push(`/agents/${key}`)}
      >
        <TableHeader>
          {allAgentsColumns.map((column) => (
            <TableColumn key={column.name} allowsSorting={column.sortable}>
              {column.name.replace(/_/g, " ")}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {agentsDataList.map((agentObj) => {
            const { roles, abilities } = agentObj;

            return (
              <TableRow key={agentObj.id} className="cursor-pointer">
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
          })}
        </TableBody>
      </Table>
    </section>
  );
}
