"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@heroui/table";
import Image from "next/image";
import { Tooltip, User } from "@heroui/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";

interface BlindType {
  id: number;
  name: string;
  icon_url: string;
  duration: number;
  cost: number;
  max_charge: number;
  deploy_cooldown?: string;
  health?: number;
  ult_points?: number;
  agents: {
    name: string;
    icon_url: string;
  };
}

const flashColumns = [
  { name: "Agent", sortable: true },
  { name: "Ability", sortable: false },
  { name: "Blind Duration", sortable: true },
  { name: "Charge", sortable: true },
  { name: "Cost", sortable: true },
  { name: "Deploy Cooldown", sortable: true },
  { name: "Health", sortable: true },
];

const nearsigntColumns = [
  { name: "Agent", sortable: true },
  { name: "Ability", sortable: false },
  { name: "Blind Duration", sortable: true },
  { name: "Charge", sortable: true },
  { name: "Cost", sortable: true },
  { name: "Deploy Cooldown", sortable: true },
  { name: "Health", sortable: true },
];

export default function SmokePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [flashData, setFlashData] = useState<any[]>([]);
  const [nearsightData, setNearsightData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: flashData, error: flashError } = await supabase
        .from("abilities")
        .select(
          "id, name, icon_url, duration, cost, deploy_cooldown, health, max_charge, ult_points, agents(*)",
        )
        .eq("category", "flash")
        .order("name", { ascending: true });

      if (flashError) {
        console.error(flashError);
      } else {
        setFlashData(flashData);
      }

      const { data: nearsigntData, error: nearsigntError } = await supabase
        .from("abilities")
        .select(
          "id, name, icon_url, duration, cost, deploy_cooldown, health, max_charge, ult_points, agents(*)",
        )
        .eq("category", "nearsight")
        .order("name", { ascending: true });

      if (nearsigntError) {
        console.error(nearsigntError);
      } else {
        setNearsightData(nearsigntData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <h1 className={title()}>Blinds</h1>
      <div>
        <h2 className="mt-6">Flash</h2>
        <Table aria-label="Flash" className="mt-4" fullWidth={true}>
          <TableHeader>
            {flashColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>

          <TableBody isLoading={isLoading} items={flashData}>
            {(flash: BlindType) => (
              <TableRow key={flash.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: flash.agents.icon_url }}
                    name={flash.agents.name}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={flash.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={flash.name}
                        height={24}
                        src={flash.icon_url}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{flash.duration}</TableCell>
                <TableCell>{flash.max_charge}</TableCell>
                <TableCell>{flash.cost}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {flash.deploy_cooldown ? flash.deploy_cooldown : "x"}
                </TableCell>
                <TableCell>{flash.health ? flash.health : "-"}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <h2 className="mt-6">Nearsight</h2>
        <Table aria-label="Nearsight" className="mt-4">
          <TableHeader>
            {nearsigntColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={isLoading} items={nearsightData}>
            {(nearsight: BlindType) => (
              <TableRow key={nearsight.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: nearsight.agents.icon_url }}
                    name={nearsight.agents.name}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={nearsight.name}>
                    <div className="cursor-pointer">
                      <Image
                        unoptimized
                        alt={nearsight.name}
                        height={24}
                        src={nearsight.icon_url}
                        width={24}
                      />
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{nearsight.duration}</TableCell>
                <TableCell>{nearsight.max_charge}</TableCell>
                <TableCell>
                  {nearsight.ult_points
                    ? `${nearsight.ult_points} ult points`
                    : nearsight.cost}
                </TableCell>
                <TableCell>
                  {nearsight.deploy_cooldown ? nearsight.deploy_cooldown : "x"}
                </TableCell>
                <TableCell>
                  {nearsight.health ? nearsight.health : "-"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
