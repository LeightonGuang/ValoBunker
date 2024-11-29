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

const columns = [
  { name: "Event", sortable: true },
  { name: "Date", sortable: true },
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
  const [isLoading, setIsLoading] = useState(true);
  const [eventsList, setEventsList] = useState<EventsTableType[]>([]);
  const [eventToDelete, setEventToDelete] = useState<EventsTableType>(
    {} as EventsTableType,
  );
  const [selectedStatus, setSelectedStatus] = useState<Selection>(
    new Set(["ongoing", "upcoming", "tbd"]),
  );
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("events")
          .select(`*`)
          .order("end_date", { ascending: true });

        if (error) throw error;

        setEventsList(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const filteredEvents = () => {
    if (selectedStatus === "all") return eventsList;

    return eventsList.filter((event) =>
      Array.from(selectedStatus).some(
        (status) =>
          status ===
          eventStatus(event.start_date, event.end_date).toLowerCase(),
      ),
    );
  };

  const deleteEventById = async (id: number) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;

      setEventsList((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "TBD";

  const renderTopContent = () => (
    <div className="flex items-center justify-between">
      <span className="text-small text-default-400">
        Total {filteredEvents().length} Events
      </span>
      <div className="flex gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<ChevronDown fill="currentColor" />}
              variant="flat"
            >
              Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Filter by Status"
            closeOnSelect={false}
            selectedKeys={selectedStatus}
            selectionMode="multiple"
            onSelectionChange={setSelectedStatus}
          >
            {statusOptions.map(({ name, uid }) => (
              <DropdownItem key={uid}>
                <Chip
                  color={
                    uid === "ended"
                      ? "danger"
                      : uid === "ongoing"
                        ? "success"
                        : "default"
                  }
                >
                  {name}
                </Chip>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button
          color="primary"
          endContent={<span>+</span>}
          onClick={() => router.push("/moderator/manage/events/add")}
        >
          Add Event
        </Button>
      </div>
    </div>
  );

  return (
    <section>
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>Events</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className={title()}>Manage Events</h1>
      <div className="mt-6">
        <Table
          aria-label="Events Table"
          selectionMode="single"
          topContent={renderTopContent()}
          topContentPlacement="outside"
        >
          <TableHeader>
            {columns.map(({ name }, i) => (
              <TableColumn key={i}>{name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {filteredEvents().map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Image
                      alt={event.name}
                      className="mr-2 h-8 min-h-8 w-8 min-w-8"
                      classNames={{ img: "rounded-none" }}
                      src={event.event_icon_url}
                    />
                    <div>{`${event.type} ${event.name}`}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {`${formatDate(event.start_date)} - ${formatDate(
                    event.end_date,
                  )}`}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.prize_pool || "/"}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      eventStatus(event.start_date, event.end_date) === "Ended"
                        ? "danger"
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
            ))}
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
          <ModalBody>
            Are you sure you want to delete the event: {eventToDelete.type}{" "}
            {eventToDelete.name}?
          </ModalBody>
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
        </ModalContent>
      </Modal>
    </section>
  );
};

export default ManageEventsPage;
