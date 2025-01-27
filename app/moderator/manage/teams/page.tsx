"use client";

import {
  User,
  Image,
  Table,
  Button,
  Tooltip,
  TableRow,
  Dropdown,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { EllipsisIcon } from "@/components/icons";
import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";

const ManageTeamsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<TeamsTableType[]>([]);
  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*, vct_league(*)")
        .order("name", { ascending: true });

      if (teamsError) {
        console.error(teamsError);
      } else {
        setTeams(teamsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const TeamsTable = () => {
    const columns: { name: string; sortable: boolean }[] = [
      { name: "Team", sortable: true },
      { name: "League", sortable: true },
      { name: "Country", sortable: true },
      { name: "Actions", sortable: false },
    ];

    const topContent = (
      <div className="flex items-center justify-between">
        <div className="text-small text-default-400">
          Total {teams.length} Teams
        </div>

        <Button
          color="primary"
          startContent={<span>+</span>}
          onPress={() => router.push("/moderator/manage/teams/create")}
        >
          Create Team
        </Button>
      </div>
    );

    return (
      <Table
        aria-label="Teams"
        selectionMode="single"
        topContent={topContent}
        topContentPlacement="outside"
        onRowAction={(key) => router.push(`/esports/teams/${key}`)}
      >
        <TableHeader>
          {columns.map((column, i) => (
            <TableColumn key={i} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody isLoading={isLoading}>
          {teams.map((team) => (
            <TableRow key={team.id} className="cursor-pointer">
              <TableCell>
                {
                  <User
                    avatarProps={{
                      src: team.logo_url,
                      classNames: {
                        base: "bg-transparent rounded-none",
                      },
                    }}
                    name={team.name}
                  />
                }
              </TableCell>

              <TableCell>
                <Tooltip content={team.vct_league.name}>
                  <Image className="h-8 w-8" src={team.vct_league.logo_url} />
                </Tooltip>
              </TableCell>

              <TableCell>{team.country}</TableCell>

              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light">
                      <EllipsisIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="edit"
                      onPress={() =>
                        router.push(`/moderator/manage/teams/edit/${team.id}`)
                      }
                    >
                      Edit
                    </DropdownItem>

                    <DropdownItem key="delete" onPress={() => {}}>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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
    <section className="w-full lg:mr-4">
      <h1 className={title()}>Manage Teams</h1>
      <div className="mt-6 w-full">
        <TeamsTable />
      </div>
    </section>
  );
};

export default ManageTeamsPage;
