"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@nextui-org/table";
import Image from "next/image";
import { Tooltip, User } from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";

interface CircularSmokeType {
  id: number;
  name: string;
  icon_url: string;
  duration: number;
  radius: number;
  cost: number;
  regen?: string;
  agents: {
    name: string;
    icon_url: string;
  };
}

interface WallSmokeType {
  id: number;
  name: string;
  icon_url: string;
  duration: number;
  length: number;
  cost: number;
  regen?: string;
  agents: {
    name: string;
    icon_url: string;
  };
}

export default function SmokesPage() {
  const circularSmokesColumns = [
    { name: "Agent", sortable: true },
    { name: "Ability", sortable: false },
    { name: "Duration", sortable: true },
    { name: "Radius", sortable: true },
    { name: "Cost", sortable: true },
    { name: "Regen", sortable: true },
  ];
  const wallSmokesColumns = [
    { name: "Agent", sortable: true },
    { name: "Ability", sortable: false },
    { name: "Duration", sortable: true },
    { name: "Length", sortable: true },
    { name: "Cost", sortable: true },
    { name: "Regen", sortable: true },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [circularSmokesData, setCircularSmokesData] = useState<any[]>([]);
  const [wallSmokesData, setWallSmokesData] = useState<any>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: circularSmokesData, error: circularSmokesError } =
        await supabase
          .from("abilities")
          .select(
            "id, name, icon_url, duration, radius, cost, regen, agents(*)",
          )
          .eq("category", "circular_smoke")
          .order("name", { ascending: true });

      if (circularSmokesError) {
        console.error(circularSmokesError);
      } else {
        console.log(circularSmokesData);
        setCircularSmokesData(circularSmokesData);
      }

      const { data: wallSmokesData, error: wallSmokesError } = await supabase
        .from("abilities")
        .select("id, name, icon_url, duration, length, cost, regen, agents(*)")
        .eq("category", "wall_smoke")
        .order("name", { ascending: true });

      if (wallSmokesError) {
        console.error(wallSmokesError);
      } else {
        console.log(wallSmokesData);
        setWallSmokesData(wallSmokesData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const CircularSmokesTable = () => {
    return (
      <Table aria-label="Circular Smokes" className="mt-4" fullWidth={true}>
        <TableHeader>
          {circularSmokesColumns.map((column) => (
            <TableColumn key={column.name} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody isLoading={isLoading} items={circularSmokesData}>
          {(smoke: CircularSmokeType) => (
            <TableRow key={smoke.id}>
              <TableCell>
                <User
                  avatarProps={{ src: smoke.agents.icon_url }}
                  name={smoke.agents.name}
                />
              </TableCell>
              <TableCell>
                <Tooltip content={smoke.name}>
                  <div className="cursor-pointer">
                    <Image
                      unoptimized
                      alt={smoke.name}
                      height={24}
                      src={smoke.icon_url}
                      width={24}
                    />
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell>{smoke.duration}</TableCell>
              <TableCell>{smoke.radius}</TableCell>
              <TableCell>{smoke.cost}</TableCell>
              <TableCell>{smoke.regen ? smoke.regen : "x"}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const WallSmokesTable = () => {
    return (
      <Table aria-label="Wall Smokes" className="mt-4">
        <TableHeader>
          {wallSmokesColumns.map((column) => (
            <TableColumn key={column.name} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody isLoading={isLoading} items={wallSmokesData}>
          {(smoke: WallSmokeType) => (
            <TableRow key={smoke.id}>
              <TableCell>
                <User
                  avatarProps={{ src: smoke.agents.icon_url }}
                  name={smoke.agents.name}
                />
              </TableCell>
              <TableCell>
                <Tooltip content={smoke.name}>
                  <div className="cursor-pointer">
                    <Image
                      unoptimized
                      alt={smoke.name}
                      height={24}
                      src={smoke.icon_url}
                      width={24}
                    />
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell>{smoke.duration}</TableCell>
              <TableCell>{smoke.length}</TableCell>
              <TableCell>{smoke.cost}</TableCell>
              <TableCell>{smoke.regen ? smoke.regen : "x"}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <h1 className={title()}>Smokes</h1>
      <div>
        <h2 className="mt-6">Circular Smokes</h2>
        <CircularSmokesTable />
      </div>

      <div className="mt-6">
        <h2 className="mt-6">Wall Smokes</h2>
        <WallSmokesTable />
      </div>
    </section>
  );
}
