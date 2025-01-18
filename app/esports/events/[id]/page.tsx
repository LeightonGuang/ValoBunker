"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Image,
} from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { EventsTableType } from "@/types/EventsTableType";

const EventPage = () => {
  const router = useRouter();
  const eventId = useParams().id;
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<EventsTableType>(
    {} as EventsTableType,
  );
  const fetchEventById = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`*, event_participants(*, teams(*)), matches(*)`)
        .eq("id", eventId)
        .single();

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setEventData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const EventCard = () => {
    const twitchChannel =
      eventData.region === "americas"
        ? "valorant_americas"
        : eventData.region === "emea"
          ? "valorant_emea"
          : eventData.region === "pacific"
            ? "valorant_pacific"
            : eventData.region === "china"
              ? "valorantesports_cn"
              : null;

    return (
      <Card className="mt-6">
        <CardHeader className="flex gap-4">
          <Image
            alt={eventData.name}
            className="h-20 min-h-20 w-20 min-w-20"
            src={eventData.event_icon_url}
          />
          <div className="flex flex-col justify-start gap-4">
            <div className="flex flex-col">
              <h1 className="text-large">{eventData.type}</h1>
              <h2 className="text-medium">{eventData.name}</h2>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
              <h3 className="flex flex-col text-sm">
                Date:
                <span>{`${eventData.start_date} - ${eventData.end_date}`}</span>
              </h3>
              <h3 className="flex flex-col text-sm">
                Location:
                <span>{eventData.location}</span>
              </h3>
              <h3 className="flex flex-col text-sm">
                Prize Pool:
                <span>{eventData.prize_pool}</span>
              </h3>
            </div>
          </div>
        </CardHeader>

        <Divider />

        <CardBody>
          <h2>Participating Teams</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-8">
            {eventData.event_participants.map((participant) => (
              <Card key={participant.team_id} shadow="sm">
                <CardHeader
                  className="cursor-pointer whitespace-nowrap text-sm hover:underline"
                  onClick={() => {
                    router.push(`/esports/teams/${participant.team_id}`);
                  }}
                >
                  {participant.teams.name}
                </CardHeader>

                <Divider />

                <CardBody>
                  <div className="flex justify-center">
                    <Image
                      classNames={{
                        img: "rounded-none",
                      }}
                      src={participant.teams.logo_url}
                    />
                  </div>
                </CardBody>

                <Divider className="my-2" />

                <CardFooter className="text-xs">
                  {participant.seeding}
                </CardFooter>
              </Card>
            ))}
          </div>

          {eventData.region && (
            <>
              <Divider className="my-2" />

              <h2>Streams</h2>

              <iframe
                allowFullScreen
                className="aspect-video h-80 w-full"
                src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=valobunker.netlify.app`}
                title="Twitch Stream"
              />
            </>
          )}

          <Divider className="my-2" />

          <div className="overflow-x-auto lg:w-full">
            <h2>Matches</h2>
            <Accordion className="mb-4 mt-4 w-max lg:w-full" variant="splitted">
              {eventData.matches.map((match) => {
                const team1 = eventData.event_participants.find(
                  (participant) => match.team1_id === participant.team_id,
                );

                const team2 = eventData.event_participants.find(
                  (participant) => match.team2_id === participant.team_id,
                );

                return (
                  <AccordionItem
                    key={match.id}
                    title={
                      <div className="flex gap-4">
                        <div className="flex w-full justify-between gap-4">
                          <div
                            className="flex flex-row items-center gap-4"
                            id="team1"
                          >
                            <Image
                              className="h-4 min-h-4 w-4 min-w-4 lg:h-8 lg:min-h-8 lg:w-8 lg:min-w-8"
                              classNames={{
                                img: "rounded-none",
                              }}
                              src={team1?.teams.logo_url}
                            />
                            <span className="text-xs lg:text-sm">
                              {team1?.teams.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Chip
                              className={`p-1 text-black ${
                                match.team1_game_score > match.team2_game_score
                                  ? "bg-[#6FEE8D]"
                                  : "bg-[#ff7272]"
                              }`}
                              radius="sm"
                            >
                              {match.team1_game_score}
                            </Chip>
                            <span>-</span>
                            <Chip
                              className={`p-1 text-black ${
                                match.team2_game_score > match.team1_game_score
                                  ? "bg-[#6FEE8D]"
                                  : "bg-[#ff7272]"
                              }`}
                              radius="sm"
                            >
                              {match.team2_game_score}
                            </Chip>
                          </div>
                          <div
                            className="flex flex-row items-center gap-4"
                            id="team2"
                          >
                            <span className="text-xs lg:text-sm">
                              {team2?.teams.name}
                            </span>
                            <Image
                              className="h-4 min-h-4 w-4 min-w-4 lg:h-8 lg:min-h-8 lg:w-8 lg:min-w-8"
                              classNames={{
                                img: "rounded-none",
                              }}
                              src={team2?.teams.logo_url}
                            />
                          </div>
                        </div>
                        <Divider orientation="vertical" />
                        <span className="hidden text-xs lg:block">
                          {match.series}
                        </span>
                      </div>
                    }
                  >
                    Maps
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </CardBody>
      </Card>
    );
  };

  useEffect(() => {
    fetchEventById();
  }, []);

  return (
    <section>
      <Breadcrumbs>
        <BreadcrumbItem href="/esports">Esports</BreadcrumbItem>
        <BreadcrumbItem href="/esports/events">Events</BreadcrumbItem>
        <BreadcrumbItem>
          <Image className="h-4 w-4" src={eventData.event_icon_url} />
          {eventData.name ? `${eventData.type} ${eventData.name}` : "Event"}
        </BreadcrumbItem>
      </Breadcrumbs>

      {!isLoading && <EventCard />}
    </section>
  );
};

export default EventPage;
