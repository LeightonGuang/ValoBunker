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
import { Image, Tooltip, User } from "@heroui/react";

import { title } from "@/components/primitives";
import MollyGraph from "@/components/MollyGraph";
import { getSupabase } from "@/utils/supabase/client";

const mollyColumns = [
  { name: "Agent", sortable: true },
  { name: "Ability", sortable: true },
  { name: "Damage", sortable: false },
  { name: "Duration", sortable: true },
  { name: "Radius", sortable: true },
  { name: "Cost", sortable: true },
];

interface MolliesType {
  id: number;
  name: string;
  icon_url: string;
  damage: string;
  duration: number;
  radius: number;
  cost: number;
  regen?: string;
  agents: {
    name: string;
    icon_url: string;
  };
}

export default function MolliesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [molliesData, setMolliesData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: molliesData, error: molliesError } = await supabase
        .from("abilities")
        .select("id, name, icon_url, damage, duration, radius, cost, agents(*)")
        .eq("category", "molly")
        .order("name", { ascending: true });

      if (molliesError) {
        console.error(molliesError);
      } else {
        setMolliesData(molliesData);
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
      <h1 className={title()}>Mollies</h1>
      <div>
        <h2 className="mt-6">All mollies</h2>
        <Table aria-label="Mollies" className="mt-4" fullWidth={true}>
          <TableHeader>
            {mollyColumns.map((column) => (
              <TableColumn key={column.name}>
                {column.name.replace(/_/g, " ")}
              </TableColumn>
            ))}
          </TableHeader>

          <TableBody isLoading={isLoading} items={molliesData}>
            {(molly: MolliesType) => (
              <TableRow>
                <TableCell>
                  <div className="flex w-max items-center">
                    <User
                      avatarProps={{ src: molly.agents.icon_url }}
                      className="gap-4"
                      name={molly.agents.name}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  {
                    <Tooltip content={molly.name}>
                      <Image
                        alt={molly.name}
                        className="h-6 w-6"
                        src={molly.icon_url}
                      />
                    </Tooltip>
                  }
                </TableCell>

                <TableCell>{molly.damage}</TableCell>

                <TableCell>{molly.duration}</TableCell>

                <TableCell>{molly.radius}</TableCell>

                <TableCell>{molly.cost}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <MollyGraph
          className="mt-4 flex w-full justify-center"
          mollies={molliesData}
        />
      </div>
    </section>
  );
}
