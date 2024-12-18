"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Image,
  Table,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  Pagination,
  TableColumn,
  TableHeader,
  Breadcrumbs,
  BreadcrumbItem,
  SortDescriptor,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { PlayersTableType } from "@/types/PlayersTableType";

const ManagePlayersPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [playersData, setPlayersData] = useState<PlayersTableType[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "ign",
    direction: "ascending",
  });
  const rowsPerPage = 10;
  const pages = Math.ceil(playersData.length / rowsPerPage);

  const sortedPlayers = useMemo(() => {
    // Sort the entire playersData array
    return [...playersData].sort((a, b) => {
      const getValue = (obj: any, path: string) => {
        return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);
      };

      const first = getValue(
        a,
        sortDescriptor.column as keyof PlayersTableType,
      );
      const second = getValue(
        b,
        sortDescriptor.column as keyof PlayersTableType,
      );

      const normalizeValue = (value: any) => {
        return value ? String(value).toLowerCase() : "";
      };

      const normalizedFirst = normalizeValue(first);
      const normalizedSecond = normalizeValue(second);

      const result = normalizedFirst.localeCompare(normalizedSecond);

      return sortDescriptor.direction === "ascending" ? result : -result;
    });
  }, [playersData, sortDescriptor]);

  const paginatedPlayers = useMemo(() => {
    // Slice the sorted array for the current page
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedPlayers.slice(start, end);
  }, [page, sortedPlayers]);

  const fetchPlayers = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("players").select(
        `*, 
        teams(
          *, vct_league(
            *
          )
        )
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
    } finally {
      setIsLoading(false);
    }
  };

  const convertedAge = (date: Date) => {
    const birthday = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();

    if (
      today.getMonth() < birthday.getMonth() ||
      today.getDate() < birthday.getDate()
    ) {
      age--;
    }

    return age;
  };

  const topContent = () => (
    <div className="flex justify-between">
      <span className="text-small text-default-400">
        Total {playersData.length} players
      </span>
    </div>
  );

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  const PlayersTable = () => {
    const tableHeaders = [
      { name: "Name", sortBy: "ign", sortable: true },
      { name: "Age", sortBy: "age", sortable: true },
      { name: "Role", sortBy: "role", sortable: true },
      { name: "Team", sortBy: "teams.name", sortable: true },
      { name: "League", sortBy: "teams.vct_league.name", sortable: true },
      { name: "Actions", sortBy: "actions", sortable: false },
    ];

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
        sortDescriptor={sortDescriptor}
        topContent={topContent()}
        topContentPlacement="outside"
        onSortChange={onSortChange}
      >
        <TableHeader>
          {tableHeaders.map((header) => (
            <TableColumn key={header.sortBy} allowsSorting={header.sortable}>
              {header.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody isLoading={isLoading} items={paginatedPlayers}>
          {(item: PlayersTableType) => (
            <TableRow key={item.id}>
              <TableCell>
                <User
                  avatarProps={{ src: item.profile_picture_url }}
                  description={item.name}
                  name={item.ign}
                />
              </TableCell>

              <TableCell>
                {item.birthday ? convertedAge(item.birthday) : "-"}
              </TableCell>

              <TableCell>{item.role}</TableCell>

              <TableCell>{item.teams.name}</TableCell>

              <TableCell>
                <Tooltip content={item.teams.vct_league.name}>
                  <Image
                    className="h-8 w-8 rounded-none object-contain"
                    src={item.teams.vct_league.logo_url}
                  />
                </Tooltip>
              </TableCell>

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
        <PlayersTable />
      </div>
    </section>
  );
};

export default ManagePlayersPage;
