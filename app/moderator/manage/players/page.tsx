"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  Breadcrumbs,
  BreadcrumbItem,
  TableColumn,
  User,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { PlayersTableType } from "@/types/PlayersTableType";

const ManagePlayersPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [playersData, setPlayersData] = useState<PlayersTableType[]>([]);
  const rowsPerPage = 10;
  const pages = Math.ceil(playersData.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return playersData.slice(start, end);
  }, [page, playersData]);

  const fetchPlayers = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("players").select(
        `*, 
        teams(
          *
        )`,
      );
      if (error) {
        console.error(error);
      } else {
        setPlayersData(data);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const PlayersTable = ({
    playersData,
  }: {
    playersData: PlayersTableType[];
  }) => {
    const tableHeaders = ["Name", "Age", "Role", "Team", "Actions"];

    return (
      <Table
        aria-label="Players"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        className="w-full"
        selectionMode="single"
        topContent={<div>{playersData.length} Players</div>}
        topContentPlacement="outside"
      >
        <TableHeader>
          {tableHeaders.map((h, i) => (
            <TableColumn key={i}>{h}</TableColumn>
          ))}
        </TableHeader>
        <TableBody isLoading={isLoading} items={items}>
          {(item: PlayersTableType) => (
            <TableRow key={item.id}>
              <TableCell>
                <User
                  avatarProps={{ src: item.profile_picture_url }}
                  description={item.name}
                  name={item.ign}
                />
              </TableCell>
              <TableCell>{item.age}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>{item.teams.name}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    router.push(`/moderator/manage/players/${item.id}`);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <section>
      <Breadcrumbs aria-label="Players" className="mb-6">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>Players</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className={title()}>Manage Players</h1>

      <div className="mt-6 w-full">
        <PlayersTable playersData={playersData} />
      </div>
    </section>
  );
};

export default ManagePlayersPage;
