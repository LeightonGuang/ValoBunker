"use client";

import {
  Chip,
  Image,
  Table,
  Button,
  Dropdown,
  TableRow,
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
import { CountdownTableType } from "@/types/CountdownTableType";

const ManageCountdownPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [countdownData, setCountdownData] = useState<CountdownTableType[]>([]);

  const tableColumns: { name: string; sortable: boolean }[] = [
    { name: "Name", sortable: true },
    { name: "Image", sortable: true },
    { name: "Same Time for all region", sortable: true },
    { name: "Start Date", sortable: true },
    { name: "End Date", sortable: true },
    { name: "Action", sortable: true },
  ];

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: countdownData, error: countdownError } = await supabase
        .from("countdown")
        .select("*")
        .order("id", { ascending: false });

      if (countdownError) {
        console.error(countdownError);
      } else {
        console.log(countdownData);
        setCountdownData(countdownData);
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
    <section className="w-full lg:mr-4">
      <h1 className={title()}>Manage Countdown</h1>

      <div className="mt-6">
        <Table
          aria-label="Manage Countdown"
          topContent={
            <div className="flex items-center justify-between">
              <span className="text-small text-default-400">
                Total {countdownData.length} Countdowns
              </span>

              <Button
                color="primary"
                endContent={<span>+</span>}
                onPress={() =>
                  router.push("/moderator/manage/countdown/create")
                }
              >
                Add Countdown
              </Button>
            </div>
          }
          topContentPlacement="outside"
        >
          <TableHeader>
            {tableColumns.map((column) => (
              <TableColumn key={column.name} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>

          <TableBody isLoading={isLoading} items={countdownData}>
            {(countdown) => {
              return (
                <TableRow key={countdown.id}>
                  <TableCell>{countdown.name}</TableCell>

                  <TableCell>
                    <Image
                      alt={countdown.name}
                      className="aspect-video h-8 rounded-none"
                      src={countdown.img_url}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      color={countdown.is_same_time ? "success" : "danger"}
                      variant="flat"
                    >
                      {countdown.is_same_time ? "Yes" : "No"}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    {countdown.start_date?.toLocaleString()}
                  </TableCell>

                  <TableCell>{countdown.end_date?.toLocaleString()}</TableCell>

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
                            router.push(
                              `/moderator/manage/countdown/edit/${countdown.id}`,
                            )
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
              );
            }}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ManageCountdownPage;
