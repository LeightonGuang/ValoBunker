"use client";

import React, { useEffect, useState } from "react";
import {
  Chip,
  Image,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { MapsTableType } from "@/types/MapsTableType";

const MapsPage = () => {
  const [maps, setMaps] = useState<MapsTableType[]>([]);
  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: mapsData, error: mapsError } = await supabase
        .from("maps")
        .select("*")
        .order("release_date", { ascending: true });

      if (mapsError) {
        console.error(mapsError);
      } else {
        console.log(mapsData);
        setMaps(mapsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const MapsTable = () => {
    const router = useRouter();
    const columns = [
      "Name",
      "Image",
      "Site Count",
      "Location",
      "Active Competitive Map",
      "Release Date",
    ];

    const topContent = (
      <div className="flex justify-between">
        <span className="text-small text-default-400">
          Total {maps.length} Maps
        </span>
      </div>
    );

    return (
      <Table
        aria-label="Maps Table"
        className="mt-6"
        selectionMode="single"
        topContent={topContent}
        topContentPlacement="outside"
        onRowAction={(name) => router.push(`/maps/${name}`)}
      >
        <TableHeader>
          {columns.map((column, i) => (
            <TableColumn key={i}>{column}</TableColumn>
          ))}
        </TableHeader>

        <TableBody>
          {maps.map((map) => (
            <TableRow key={map.name} className="cursor-pointer">
              <TableCell>{map.name}</TableCell>

              <TableCell>
                <Image className="w-24 rounded-md" src={map.cover_img_url} />
              </TableCell>

              <TableCell>{map.site_count}</TableCell>

              <TableCell>{map.location}</TableCell>

              <TableCell>
                <Chip
                  color={map.competitive_map_pool ? "success" : "danger"}
                  variant="flat"
                >
                  {map.competitive_map_pool ? "Yes" : "No"}
                </Chip>
              </TableCell>

              <TableCell>
                {map.release_date ? map.release_date.toLocaleString() : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full">
      <h1 className={title()}>Maps</h1>

      <MapsTable />
    </section>
  );
};

export default MapsPage;
