"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chip, Image } from "@nextui-org/react";

import { title } from "@/components/primitives";
import { eventStatus } from "@/utils/eventStatus";
import { getSupabase } from "@/utils/supabase/client";
import { EventsTableType } from "@/types/EventsTableType";

const columnsHeader: { name: string; sortable: boolean }[] = [
  { name: "Event", sortable: true },
  { name: "Date", sortable: true },
  { name: "Location", sortable: true },
  { name: "Prize Pool", sortable: true },
  { name: "Status", sortable: true },
];
const EventsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [eventsList, setEventsList] = useState<EventsTableType[]>([]);

  const getAllEvents = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`*`)
        .order("end_date", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        // console.log(data);
        setEventsList(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <section>
      <h1 className={title()}>Events</h1>
      <div className="mt-6">
        <Table
          aria-label="Events"
          selectionMode="single"
          onRowAction={(key) => router.push(`/esports/events/${key}`)}
        >
          <TableHeader>
            {columnsHeader.map((column, i) => (
              <TableColumn key={i}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {eventsList.map((event) => {
              const startDate = event.start_date
                ? new Date(event.start_date)
                : "";
              const endDate = event.end_date ? new Date(event.end_date) : "";

              const formatDate = (date: Date) => {
                return date.toLocaleDateString("en-GB");
              };

              return (
                <TableRow key={event.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center">
                      <Image
                        alt={event.name}
                        className="mr-2 h-8 min-h-8 w-8 min-w-8"
                        src={event.event_icon_url}
                      />
                      <div>{`${event.type} ${event.name}`}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="lg:whitespace-nowrap">
                      <span className="whitespace-nowrap">
                        {startDate ? formatDate(startDate) : "TBD"}
                      </span>
                      {" - "}
                      <span className="whitespace-nowrap">
                        {endDate ? formatDate(endDate) : "TBD"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {event.location}
                  </TableCell>

                  <TableCell>
                    {!event.prize_pool ? "/" : event.prize_pool}
                  </TableCell>

                  <TableCell>
                    <Chip
                      color={
                        eventStatus(event.start_date, event.end_date) ===
                        "Upcoming"
                          ? "default"
                          : eventStatus(event.start_date, event.end_date) ===
                              "Ongoing"
                            ? "success"
                            : eventStatus(event.start_date, event.end_date) ===
                                "Ended"
                              ? "danger"
                              : "default"
                      }
                    >
                      {eventStatus(event.start_date, event.end_date)}
                    </Chip>
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
