"use client";

import { Key, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Selection,
  TableColumn,
  TableHeader,
  SortDescriptor,
} from "@heroui/table";
import {
  Chip,
  User,
  Image,
  Input,
  Button,
  Tooltip,
  Dropdown,
  Pagination,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { PlayersTableType } from "@/types/PlayersTableType";
import { ChevronDown, SearchIcon } from "@/components/icons";
import { VctLeaguesTableType } from "@/types/VctLeaguesTableType";

const headerColumns = [
  { name: "Name", sortBy: "ign", sortable: true },
  { name: "Country", sortBy: "country", sortable: true },
  { name: "Team", sortBy: "teams.name", sortable: true },
  { name: "Role", sortBy: "role", sortable: false },
  { name: "Age", sortBy: "age", sortable: true },
  { name: "League", sortBy: "teams.vct_league.name", sortable: true },
];

const PlayersPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [playersData, setPlayersData] = useState<PlayersTableType[]>([]);
  const [vctLeagues, setVctLeagues] = useState<VctLeaguesTableType[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedLeagueKey, setSelectedLeagueKey] = useState<Selection>(
    new Set([]),
  );
  const [leagueFilter, setLeagueFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "ign",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const hasSearchFilter = Boolean(filterValue);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: playersData, error: playersError }: any = await supabase
        .from("players")
        .select(`*, teams(*, vct_league(*))`)
        .order("ign", { ascending: true });

      if (playersError) {
        console.error(playersError);
      } else {
        setPlayersData(playersData);
      }

      const { data: vctLeaguesData, error: vctLeaguesError } = await supabase
        .from("vct_leagues")
        .select("*")
        .order("id", { ascending: true });

      if (vctLeaguesError) {
        console.error(vctLeaguesError);
      } else {
        setVctLeagues(vctLeaguesData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlayers = useMemo(() => {
    let filteredPlayersData = [...playersData];

    if (hasSearchFilter) {
      filteredPlayersData = filteredPlayersData.filter((player) =>
        player.ign.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (
      leagueFilter !== "all" &&
      Array.from(leagueFilter).length !== vctLeagues.length
    ) {
      filteredPlayersData = filteredPlayersData.filter((player) =>
        Array.from(leagueFilter).includes(
          player.teams.vct_league.id.toString(),
        ),
      );
    }

    return filteredPlayersData;
  }, [playersData, filterValue, leagueFilter, vctLeagues]);

  const pages = Math.ceil(filteredPlayers.length / rowsPerPage);

  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      const first = a[
        sortDescriptor.column as keyof PlayersTableType
      ] as number;
      const second = b[
        sortDescriptor.column as keyof PlayersTableType
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredPlayers]);

  const players = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedPlayers.slice(start, end);
  }, [sortedPlayers, page]);

  const renderCell = useCallback((player: PlayersTableType, columnKey: Key) => {
    const convertedAge = (date: string | Date) => {
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

    switch (columnKey) {
      case "ign": {
        return (
          <User
            avatarProps={{ src: player.profile_picture_url }}
            description={player.name}
            name={player.ign}
          />
        );
      }

      case "country": {
        return <>{player.country}</>;
      }

      case "teams.name": {
        return (
          <Tooltip content={player.teams.name}>
            <Image
              alt={player.teams.name}
              className="h-8 w-8 rounded-none object-contain"
              src={player.teams.logo_url}
            />
          </Tooltip>
        );
      }

      case "role": {
        return (
          <div className="flex gap-2">
            {player.roles.map((role) => (
              <Chip
                key={
                  role === "1"
                    ? "Controller"
                    : role === "2"
                      ? "Duelist"
                      : role === "3"
                        ? "Initiator"
                        : role === "4"
                          ? "Sentinel"
                          : role
                }
                color={
                  role === "1"
                    ? "success"
                    : role === "2"
                      ? "danger"
                      : role === "3"
                        ? "warning"
                        : role === "4"
                          ? "secondary"
                          : role === "IGL"
                            ? "primary"
                            : "default"
                }
                variant="flat"
              >
                {role === "1"
                  ? "Controller"
                  : role === "2"
                    ? "Duelist"
                    : role === "3"
                      ? "Initiator"
                      : role === "4"
                        ? "Sentinel"
                        : role}
              </Chip>
            ))}
          </div>
        );
      }

      case "age": {
        return <>{player.birthday ? convertedAge(player.birthday) : "-"}</>;
      }

      case "teams.vct_league.name": {
        return (
          <Tooltip content={player.teams.vct_league.name}>
            <Image
              className="h-8 w-8 rounded-none object-contain"
              src={player.teams.vct_league.logo_url}
            />
          </Tooltip>
        );
      }
    }
  }, []);

  const onSearchChange = useCallback((ign?: string) => {
    if (ign) {
      setFilterValue(ign);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <span className="text-small text-default-400">
          {`Total ${playersData.length} players`}
        </span>

        <div className="flex justify-end gap-2">
          <Input
            isClearable
            className="w-full max-w-[50%] lg:max-w-40"
            placeholder="Search by IGN"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => {
              setFilterValue("");
              setPage(1);
            }}
            onValueChange={onSearchChange}
          />

          <Dropdown className="w-1/2">
            <DropdownTrigger>
              <Button
                endContent={<ChevronDown fill="currentColor" size={16} />}
              >
                League
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              disallowEmptySelection
              aria-label="League"
              closeOnSelect={false}
              selectedKeys={leagueFilter}
              selectionMode="multiple"
              onSelectionChange={setLeagueFilter}
            >
              {vctLeagues.map((league) => (
                <DropdownItem
                  key={league.id}
                  aria-selected="false"
                  textValue={league.name}
                >
                  <User
                    avatarProps={{
                      isBordered: false,
                      size: "sm",
                      src: league.logo_url,
                      className: "bg-transparent rounded-none",
                    }}
                    name={league.name}
                  />
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    ),
    [playersData, leagueFilter, vctLeagues, onSearchChange, filterValue],
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full items-center justify-center">
        <Pagination
          isCompact
          showControls
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedLeagueKey, players.length, page, pages, hasSearchFilter]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [leagueFilter, sortDescriptor]);

  return (
    <section>
      <h1 className={title()}>Players</h1>

      <div className="mt-6 w-full">
        <Table
          aria-label="Players"
          bottomContent={bottomContent}
          selectedKeys={selectedLeagueKey}
          selectionMode="single"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedLeagueKey}
          onSortChange={setSortDescriptor}
          onRowAction={(key) => router.push(`/esports/players/${key}`)}
        >
          <TableHeader>
            {headerColumns.map((header) => (
              <TableColumn key={header.sortBy} allowsSorting={header.sortable}>
                {header.name}
              </TableColumn>
            ))}
          </TableHeader>

          <TableBody
            emptyContent="No players found"
            isLoading={isLoading}
            items={players}
          >
            {(player) => (
              <TableRow key={player.id} className="cursor-pointer">
                {(columnKey) => (
                  <TableCell>{renderCell(player, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default PlayersPage;
