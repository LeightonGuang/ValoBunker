"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import { getSupabase } from "@/utils/supabase/client";
import { PatchesTableType } from "@/types/PatchesTableType";
import { EventsTableType } from "@/types/EventsTableType";
export default function Home() {
  const [patchNotesList, setPatchNotesList] = useState<PatchesTableType[]>([]);
  const [eventList, setEventList] = useState<EventsTableType[]>([]);
  const getAllPatchNotes = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("patches")
        .select(`*`)
        .order("release_date", { ascending: false });

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
        .order("start_date", { ascending: true });

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
        <Card className="h-min w-full lg:order-2 lg:w-72">
          <CardHeader>Upcoming Events</CardHeader>
          <Divider />
          <CardBody>
            <Listbox aria-label="Events" items={eventList}>
              {eventList.map((eventObj, i) => (
                <ListboxItem
                  key={eventObj.id}
                  description={
                    <div className="flex flex-col">
                      <span className="text-white text-small">
                        {eventObj.type}
                      </span>
                      <span>{eventObj.name}</span>
                      <span className="whitespace-nowrap">{`${eventObj.start_date} - ${eventObj.end_date}`}</span>
                    </div>
                  }
                  showDivider={i !== eventList.length - 1}
                  startContent={
                    <Image
                      className="min-h-8 min-w-8"
                      height={32}
                      src={eventObj.event_icon_url}
                      width={32}
                    />
                  }
                />
              ))}
            </Listbox>
          </CardBody>
        </Card>
        <Card className="w-full lg:order-1">
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
