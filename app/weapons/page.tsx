"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@heroui/table";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { WeaponsTableType } from "@/types/WeaponsTableType";

export default function WeaponsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [weaponsData, setWeaponsData] = useState<WeaponsTableType[]>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: weaponsData, error: weaponsError } = await supabase
        .from("weapons")
        .select("*");

      if (weaponsError) {
        console.error(weaponsError);
      } else {
        console.log(weaponsData);
        setWeaponsData(weaponsData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const weaponsColumns = [
    { name: "Name", key: "name", sortable: true },
    { name: "Type", key: "type", sortable: false },
    { name: "Image", key: "img_url", sortable: true },
    { name: "Cost", key: "cost", sortable: true },
    { name: "Range: Head / Body / Leg", key: "damage_list", sortable: true },
    { name: "Fire Rate", key: "fire_rate", sortable: true },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <h1 className={title()}>Weapons</h1>
      <div>
        <h2 className="mt-6">Weapons</h2>
        <Table aria-label="Weapons" className="mt-4" fullWidth={true}>
          <TableHeader>
            {weaponsColumns.map((column) => (
              <TableColumn key={column.name}>{column.name}</TableColumn>
            ))}
          </TableHeader>

          <TableBody isLoading={isLoading} items={weaponsData}>
            {(weapon) => {
              return (
                <TableRow key={weapon.id}>
                  <TableCell>{weapon.name}</TableCell>

                  <TableCell>{weapon.type}</TableCell>

                  <TableCell>
                    <div className="w-16 cursor-pointer">
                      <Image
                        alt={weapon.name}
                        className="aspect-auto h-10 rounded-none object-contain"
                        src={weapon.img_url}
                      />
                    </div>
                  </TableCell>

                  <TableCell>{weapon.cost}</TableCell>

                  <TableCell>x</TableCell>

                  <TableCell className="whitespace-nowrap">x</TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
