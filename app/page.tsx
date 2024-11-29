"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Link,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getSupabase } from "@/utils/supabase/client";
import { PatchesTableType } from "@/types/PatchesTableType";
import { EventsTableType } from "@/types/EventsTableType";
import { eventStatus } from "@/utils/eventStatus";
export default function Home() {
  const router = useRouter();
  const [patchNotesList, setPatchNotesList] = useState<PatchesTableType[]>([]);
  const [eventList, setEventList] = useState<EventsTableType[]>([]);
  const getAllPatchNotes = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("patches")
        .select(`*`)
        .order("release_date", { ascending: false })
        .limit(3);

      if (error) {
        console.error(error);
      } else {
        setPatchNotesList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllEvents = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`*`)
        .order("end_date", { ascending: true })
        .gte("end_date", new Date().toISOString())
        .limit(4);

      if (error) {
        console.error(error);
      } else {
        setEventList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPatchNotes();
    getAllEvents();
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card aria-label="Events" className="h-min w-full lg:order-2 lg:w-96">
          <CardHeader
            className="w-min cursor-pointer hover:underline"
            onClick={() => router.push("/esports/events")}
          >
            Events
          </CardHeader>
          <Divider />
          <CardBody>
            <Listbox
              aria-label="Events"
              items={eventList}
              onAction={(key) => router.push(`/esports/events/${key}`)}
            >
              {eventList.map((eventObj, i) => {
                const todayDate = new Date();

                todayDate.setHours(0, 0, 0, 0);

                return (
                  <ListboxItem
                    key={eventObj.id}
                    description={
                      <div className="flex flex-col">
                        <span className="flex justify-between text-small text-white">
                          {eventObj.type}{" "}
                          <Chip
                            className="border-none"
                            color={
                              eventStatus(
                                eventObj.start_date,
                                eventObj.end_date,
                              ) === "Upcoming"
                                ? "default"
                                : eventStatus(
                                      eventObj.start_date,
                                      eventObj.end_date,
                                    ) === "Ongoing"
                                  ? "success"
                                  : eventStatus(
                                        eventObj.start_date,
                                        eventObj.end_date,
                                      ) === "Ended"
                                    ? "danger"
                                    : "default"
                            }
                            size="sm"
                            variant="dot"
                          >
                            {eventStatus(
                              eventObj.start_date,
                              eventObj.end_date,
                            )}
                          </Chip>
                        </span>
                        <span>{eventObj.name}</span>
                        <span className="whitespace-nowrap">{`${eventObj.start_date} - ${eventObj.end_date}`}</span>
                      </div>
                    }
                    showDivider={i !== eventList.length - 1}
                    startContent={
                      <Image
                        className="min-h-8 min-w-8"
                        classNames={{
                          img: "rounded-none",
                        }}
                        height={32}
                        src={eventObj.event_icon_url}
                        width={32}
                      />
                    }
                    textValue={eventObj.name}
                  />
                );
              })}
            </Listbox>
          </CardBody>
        </Card>
        <Card aria-label="News" className="w-full lg:order-1">
          <CardHeader className="text-large">News</CardHeader>
          <Divider />
          <CardBody>
            <Listbox
              aria-label="News"
              classNames={{ list: "gap-2" }}
              items={patchNotesList}
            >
              {patchNotesList.map((patchObj, i) => (
                <ListboxItem
                  key={patchObj.id}
                  classNames={{
                    title: "text-large",
                    base: "flex-col lg:flex-row",
                  }}
                  description={patchObj.description}
                  endContent={
                    <div className="mt-2 flex w-full justify-between lg:h-full lg:w-min lg:flex-col lg:justify-start lg:gap-4">
                      <span className="order-2 whitespace-nowrap text-tiny text-foreground-500 lg:order-1">
                        {patchObj.release_date}
                      </span>
                      <Link
                        isExternal
                        showAnchorIcon
                        className="order-1 whitespace-nowrap text-tiny lg:order-2"
                        href={patchObj.patch_note_link}
                      >
                        Patch Notes
                      </Link>
                    </div>
                  }
                  showDivider={i !== patchNotesList.length - 1}
                  startContent={
                    <Image
                      className="h-full w-full lg:w-[12.5rem]"
                      src={patchObj.banner_url}
                    />
                  }
                  textValue={patchObj.title}
                  title={`${patchObj.patch_num} ${patchObj.title}`}
                />
              ))}
            </Listbox>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
