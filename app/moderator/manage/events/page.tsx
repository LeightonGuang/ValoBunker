"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableColumn,
  TableHeader,
} from "@nextui-org/table";
import {
  Chip,
  Modal,
  Image,
  Dropdown,
  ModalBody,
  Selection,
  ModalFooter,
  ModalContent,
  DropdownItem,
  DropdownMenu,
  useDisclosure,
  DropdownTrigger,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { EventsTableType } from "@/types/EventsTableType";
import { ChevronDown, EllipsisIcon } from "@/components/icons";
import { eventStatus } from "@/utils/eventStatus";

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

const statusOptions = [
  { name: "Ended", uid: "ended" },
  { name: "Ongoing", uid: "ongoing" },
  { name: "Upcoming", uid: "upcoming" },
  { name: "TBD", uid: "tbd" },
];

const ManageEventsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventsList, setEventsList] = useState<EventsTableType[]>([]);
  const [eventToDelete, setEventToDelete] = useState<EventsTableType>(
    {} as EventsTableType,
  );
  const [selectedStatus, setSelectedStatus] = useState<Selection>(
    new Set(["ongoing", "upcoming", "tbd"]),
  );
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

  const filteredItems = () => {
    let filteredEvents = [...eventsList];

    if (selectedStatus !== "all" && Array.from(selectedStatus).length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        Array.from(selectedStatus).some(
          (status) =>
            status ===
            eventStatus(event.start_date, event.end_date).toLowerCase(),
        ),
      );
    }

    return filteredEvents;
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
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDown fill="currentColor" />}
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={selectedStatus}
              selectionMode="multiple"
              onSelectionChange={setSelectedStatus}
            >
              {statusOptions.map((status) => (
                <DropdownItem
                  key={status.uid}
                  className="capitalize"
                  textValue={status.uid}
                >
                  {
                    <Chip
                      color={
                        status.uid === "ended"
                          ? "danger"
                          : status.uid === "upcoming"
                            ? "default"
                            : status.uid === "ongoing"
                              ? "success"
                              : "default"
                      }
                    >
                      {status.name}
                    </Chip>
                  }
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
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
      </div>
    );
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <section>
      <Breadcrumbs aria-label="breadcrumb" className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>Events</BreadcrumbItem>
      </Breadcrumbs>
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
            {filteredItems().map((event) => {
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
                        eventStatus(event.start_date, event.end_date) ===
                        "Ended"
                          ? "danger"
                          : eventStatus(event.start_date, event.end_date) ===
                              "Upcoming"
                            ? "default"
                            : eventStatus(event.start_date, event.end_date) ===
                                "Ongoing"
                              ? "success"
                              : "default"
                      }
                    >
                      {eventStatus(event.start_date, event.end_date)}
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
