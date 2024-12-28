"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Chip,
  User,
  Image,
  Table,
  Input,
  Button,
  Tooltip,
  Dropdown,
  TableRow,
  Selection,
  TableBody,
  TableCell,
  Pagination,
  TableColumn,
  TableHeader,
  Breadcrumbs,
  DropdownItem,
  DropdownMenu,
  BreadcrumbItem,
  SortDescriptor,
  DropdownTrigger,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { PlayersTableType } from "@/types/PlayersTableType";
import { ChevronDown, SearchIcon } from "@/components/icons";
import { VctLeaguesTableType } from "@/types/VctLeaguesTableType";
import { RolesTableType } from "@/types/RolesTableType";

const tableHeaders = [
  { name: "Name", sortBy: "ign", sortable: true },
  { name: "Country", sortBy: "country", sortable: true },
  { name: "Team", sortBy: "teams.name", sortable: true },
  { name: "Role", sortBy: "role", sortable: false },
  { name: "Age", sortBy: "age", sortable: true },
  { name: "League", sortBy: "teams.vct_league.name", sortable: true },
  { name: "Actions", sortBy: "actions", sortable: false },
];

const ManagePlayersPage = () => {
  const router = useRouter();
  const [playersData, setPlayersData] = useState<PlayersTableType[]>([]);
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const [leagueFilter, setLeagueFilter] = useState<Selection>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [vctLeagues, setVctLeagues] = useState<VctLeaguesTableType[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "ign",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [roleData, setRoleData] = useState<RolesTableType[]>([]);

  const rowsPerPage = 10;

  const hasSearchFilter = Boolean(searchFilterValue);

  const filteredItems = useMemo(() => {
    let filteredPlayers = [...playersData];

    // Search bar filtering
    if (hasSearchFilter) {
      filteredPlayers = filteredPlayers.filter((player) =>
        player.ign.toLowerCase().includes(searchFilterValue.toLowerCase()),
      );
    }

    // League dropdown filtering
    if (leagueFilter !== "all" && leagueFilter.size > 0) {
      const selectedLeagues = Array.from(leagueFilter).map(String);

      filteredPlayers = filteredPlayers.filter(
        (player) =>
          player.teams?.vct_league &&
          selectedLeagues.includes(String(player.teams.vct_league.id)),
      );
    }

    return filteredPlayers;
  }, [playersData, searchFilterValue, leagueFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedPlayers = useMemo(() => {
    // Sort the entire playersData array
    return [...filteredItems].sort((a, b) => {
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
  }, [filteredItems, sortDescriptor]);

  const paginatedPlayers = useMemo(() => {
    // Slice the sorted array for the current page
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedPlayers.slice(start, end);
  }, [page, filteredItems, sortedPlayers]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: playersData, error: playersError }: any = await supabase
        .from("players")
        .select(
          `
        *, teams(
          *, vct_league(
            *
            )
          )
        )
      `,
        )
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

      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("*")
        .order("id", { ascending: true });

      if (roleError) {
        console.error(roleError);
      } else {
        setRoleData(roleData);
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

  const onSearchChange = useCallback((ign?: string) => {
    if (ign) {
      setSearchFilterValue(ign);
      setPage(1);
    } else {
      setSearchFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    const searchInput = (
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Search by IGN"
        startContent={<SearchIcon />}
        value={searchFilterValue}
        onClear={() => {
          setSearchFilterValue("");
          setPage(1);
        }}
        onValueChange={onSearchChange}
      />
    );

    const leagueDropdown = (
      <Dropdown>
        <DropdownTrigger>
          <Button endContent={<ChevronDown fill="currentColor" />}>
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
    );

    const addButton = (
      <Button
        color="primary"
        endContent={<span>+</span>}
        onPress={() => router.push("/moderator/manage/players/add")}
      >
        Player
      </Button>
    );

    return (
      <div className="flex justify-between">
        <span className="flex items-center text-small text-default-400">
          Total {playersData.length} players
        </span>

        <div className="flex w-fit justify-end gap-2">
          {searchInput}
          {leagueDropdown}
          {addButton}
        </div>
      </div>
    );
  }, [
    playersData,
    searchFilterValue,
    vctLeagues,
    leagueFilter,
    onSearchChange,
    router,
  ]);

  const onSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <Breadcrumbs aria-label="Players" className="mb-6">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>Players</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className={title()}>Manage Players</h1>

      <div className="mt-6 w-full">
        <Table
          aria-label="Players"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
              />
            </div>
          }
          className="w-full"
          selectionMode="single"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
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
          <TableBody
            emptyContent="No players found"
            isLoading={isLoading}
            items={isLoading ? [] : paginatedPlayers}
          >
            {(item: PlayersTableType) => (
              <TableRow key={item.id}>
                <TableCell>
                  <User
                    avatarProps={{ src: item.profile_picture_url }}
                    description={item.name}
                    name={item.ign}
                  />
                </TableCell>

                <TableCell>{item.country}</TableCell>

                <TableCell>
                  <Tooltip content={item.teams.name}>
                    <Image
                      className="h-8 w-8 rounded-none object-contain"
                      src={item.teams.logo_url}
                    />
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {item.roles.map((role) => (
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
                </TableCell>

                <TableCell>
                  {item.birthday ? convertedAge(item.birthday) : "-"}
                </TableCell>

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
      </div>
    </section>
  );
};

export default ManagePlayersPage;
