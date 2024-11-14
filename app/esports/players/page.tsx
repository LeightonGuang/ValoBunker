"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Image from "next/image";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { PlayersTableType } from "@/types/PlayersTableType";
import { User } from "@nextui-org/react";

const PlayersPage = () => {
  const [playersList, setPlayersList] = useState<
    PlayersTableType[] | undefined
  >([]);

  const getAllPlayers = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("players").select(`
        *,
        teams (
          *
        )
      `);
      const sortedData: PlayersTableType[] | undefined = data?.sort((a, b) =>
        a.id > b.id ? 1 : -1,
      );

      console.log(sortedData);
      setPlayersList(sortedData);

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  const tableHeaders: string[] = ["name", "team", "role", "country"];

  return (
    <section>
      <h1 className={title()}>Players</h1>
      <div className="mt-6">
        <Table aria-label="Players">
          <TableHeader>
            {tableHeaders.map((header: string, i: number) => (
              <TableColumn key={i}>{header}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {(playersList || []).map((player: PlayersTableType) => (
              <TableRow key={player.id}>
                <TableCell className="whitespace-nowrap">
                  <User
                    avatarProps={{ src: player.profile_picture_url }}
                    description={player.name}
                    name={player.ign}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {player.teams.name}
                </TableCell>
                <TableCell>{player.role}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {player.country}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default PlayersPage;
