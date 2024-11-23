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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { EventsTableType } from "@/types/EventsTableType";
import { EllipsisIcon } from "@/components/icons";

const patchColumns: { name: string; sortable: boolean }[] = [
  {
    name: "Event",
    sortable: true,
  },
  {
    name: " Date",
    sortable: true,
  },
  { name: "Location", sortable: true },
  { name: "Prize Pool", sortable: true },
  { name: "Status", sortable: true },
  { name: "Actions", sortable: false },
];

const ManageEventsPage = () => {
  const [eventsList, setEventsList] = useState<EventsTableType[]>([]);
  const [eventToDelete, setEventToDelete] = useState<EventsTableType>({
    id: 0,
    type: "",
    name: "",
    event_icon_url: "",
    location: "",
    start_date: "",
    end_date: "",
    created_at: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const router = useRouter();
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
        setEventsList(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEventById = async (id: number) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
      } else {
        // console.log(data);
        getAllEvents();
      }

      if (error) {
        console.error(error);
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

          <TableBody isLoading={isLoading}>
            {eventsList.map((event) => {
              const currentDate = new Date();

              currentDate.setHours(0, 0, 0, 0);
              const startDate = event.start_date
                ? new Date(event.start_date)
                : "";
              const endDate = event.end_date ? new Date(event.end_date) : "";

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
                    <div>{event.prize_pool || "/"}</div>
                  </TableCell>

                  <TableCell>
                    <Chip
                      color={
                        currentDate < startDate
                          ? "default"
                          : (startDate < currentDate &&
                                currentDate <= endDate) ||
                              (startDate < currentDate && endDate === "")
                            ? "success"
                            : currentDate > endDate
                              ? "danger"
                              : "default"
                      }
                    >
                      {currentDate < startDate
                        ? "Upcoming"
                        : (startDate < currentDate && currentDate <= endDate) ||
                            (startDate < currentDate && endDate === "")
                          ? "Ongoing"
                          : endDate < currentDate && "Ended"}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light">
                          <EllipsisIcon />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() =>
                            router.push(
                              `/moderator/manage/events/edit/${event.id}`,
                            )
                          }
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            onOpen();
                            setEventToDelete(event);
                          }}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isOpen}
        size="md"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>{`Are you sure you want to delete the event: ${eventToDelete.type} ${eventToDelete.name}?`}</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  color="danger"
                  onClick={() => {
                    deleteEventById(eventToDelete.id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default ManageEventsPage;
