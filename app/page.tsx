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

import { eventStatus } from "@/utils/eventStatus";
import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";
import { EventsTableType } from "@/types/EventsTableType";
import { PatchesTableType } from "@/types/PatchesTableType";
import { Span } from "next/dist/trace";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsTableType[]>([]);
  const [patchNotesList, setPatchNotesList] = useState<PatchesTableType[]>([]);
  const [eventList, setEventList] = useState<EventsTableType[]>([]);

  const getAllData = async () => {
    try {
      const supabase = getSupabase();

      const [newsResponse, patchNotesResponse, eventsResponse] =
        await Promise.all([
          supabase
            .from("news")
            .select(`*`)
            .order("news_date", { ascending: false })
            .limit(4),
          supabase
            .from("patches")
            .select(`*`)
            .order("release_date", { ascending: false })
            .limit(3),
          supabase
            .from("events")
            .select(`*`)
            .order("end_date", { ascending: true })
            .gte("end_date", new Date().toISOString())
            .limit(4),
        ]);

      if (
        newsResponse.error ||
        patchNotesResponse.error ||
        eventsResponse.error
      ) {
        console.error(
          newsResponse.error ||
            patchNotesResponse.error ||
            eventsResponse.error,
        );
      } else {
        setNewsList(newsResponse.data);
        setPatchNotesList(patchNotesResponse.data);
        setEventList(eventsResponse.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          className="order-2 flex w-full flex-col gap-4 lg:order-1"
          id="main-content"
        >
          <Card aria-label="News">
            <CardHeader className="text-large">News</CardHeader>
            <Divider />
            <CardBody>
              <Listbox aria-label="News">
                {newsList.map((newsObj, i) => (
                  <ListboxItem
                    key={newsObj.id}
                    description={newsObj.content}
                    endContent={
                      <span className="h-max whitespace-nowrap text-tiny text-foreground-500">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(newsObj.news_date))}
                      </span>
                    }
                    showDivider={i !== newsList.length - 1}
                    startContent={
                      <Image
                        className="h-12 min-h-12 w-12 min-w-12 rounded-none"
                        src={newsObj.img_url}
                      />
                    }
                    textValue={newsObj.title}
                    title={<span className="text-medium">{newsObj.title}</span>}
                  />
                ))}
              </Listbox>
            </CardBody>
          </Card>

          <Card aria-label="Patch Notes">
            <CardHeader className="text-large">Patch Notes</CardHeader>
            <Divider />
            <CardBody>
              <Listbox
                aria-label="Patch Notes"
                classNames={{ list: "gap-2" }}
                items={patchNotesList}
              >
                {patchNotesList.map((patchObj, i) => (
                  <ListboxItem
                    key={patchObj.id}
                    classNames={{
                      title: "text-medium",
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
        <div className="order-1 w-full lg:order-2 lg:w-96" id="side-content">
          <Card aria-label="Events" className="h-min">
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
                  // const todayDate = new Date().setHours(0, 0, 0, 0);

                  const formatDate = (date: Date) => {
                    return date.toLocaleDateString("en-GB");
                  };

                  const startDate = formatDate(
                    new Date(eventObj.start_date ?? ""),
                  );
                  const endDate = formatDate(new Date(eventObj.end_date ?? ""));

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
                          <span className="whitespace-nowrap">
                            {startDate} - {endDate}
                          </span>
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
        </div>
      </div>
    </section>
  );
}
