"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { EventsTableType } from "@/types/EventsTableType";

const patchColumns: { name: string; sortable: boolean }[] = [
  {
    name: "Name",
    sortable: true,
  },
  {
    name: " Date",
    sortable: true,
  },
  { name: "Location", sortable: true },
  { name: "Status", sortable: true },
  { name: "Actions", sortable: false },
];

const EventsPage = () => {
  const [eventsList, setEventsList] = useState<EventsTableType[]>([]);

  const router = useRouter();
  const getAllEvents = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`*`)
        .order("start_date", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setEventsList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const topContent = () => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-small text-default-400">
          Total {eventsList.length} Events
        </span>
        <Button
          color="primary"
          endContent={<span>+</span>}
          onClick={() => {
            router.push("/moderator/manage/events/add");
          }}
        >
          Add Event
        </Button>
      </div>
    );
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <section>
      <h1 className={title()}>Manage Events</h1>
      <div className="mt-6">
        <Table
          aria-label="Patches"
          selectionMode="single"
          topContent={topContent()}
          topContentPlacement="outside"
        >
          <TableHeader columns={patchColumns}>
            {patchColumns.map((column, i) => (
              <TableColumn key={i}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {eventsList.map((event) => {
              const currentDate = new Date();
              const startDate = new Date(event.start_date);
              const endDate = new Date(event.end_date);

              const formatDate = (date: Date) => {
                return date.toLocaleDateString("en-GB");
              };

              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Image
                        alt={event.name}
                        className="mr-2 h-8 min-h-8 w-8 min-w-8"
                        src={event.event_icon_url}
                      />
                      <div>{`${event.type}: ${event.name}`}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {event.start_date ? formatDate(startDate) : "unknown"}
                    </span>
                    {" - "}
                    <span className="whitespace-nowrap">
                      {event.end_date ? formatDate(endDate) : "unknown"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {event.location}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        currentDate < startDate
                          ? "default"
                          : currentDate > startDate && currentDate < endDate
                            ? "success"
                            : currentDate > endDate
                              ? "danger"
                              : "default"
                      }
                    >
                      {currentDate < startDate
                        ? "Upcoming"
                        : currentDate > startDate && currentDate < endDate
                          ? "Ongoing"
                          : currentDate > endDate
                            ? "Ended"
                            : "Unknown"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button>more</Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem>Edit</DropdownItem>
                        <DropdownItem>Delete</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default EventsPage;
