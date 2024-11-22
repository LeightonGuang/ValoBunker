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
import { Chip } from "@nextui-org/react";
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

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <section>
      <h1 className={title()}>Events</h1>
      <div className="mt-6">
        <Table aria-label="Patches" selectionMode="single">
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
                    <span className="whitespace-nowrap">{event.type}</span>{" "}
                    <span className="whitespace-nowrap">{event.name}</span>
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
                    <Button>D</Button>
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
