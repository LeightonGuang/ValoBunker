"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
        .eq("id", eventId);

      if (error) {
        console.error(error);
      } else {
        console.log(data[0]);
        setEventData(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventById();
  }, []);

  return (
    <section>
      <Breadcrumbs>
        <BreadcrumbItem href="/esports">ESports</BreadcrumbItem>
        <BreadcrumbItem href="/esports/events">Events</BreadcrumbItem>
        <BreadcrumbItem>{`${eventData.type} ${eventData.name}`}</BreadcrumbItem>
      </Breadcrumbs>
      {!isLoading && (
        <Card className="mt-6">
          <CardHeader className="flex gap-4">
            <Image
              alt={eventData.name}
              className="h-20 min-h-20 w-20 min-w-20"
              src={eventData.event_icon_url}
            />
            <div className="flex flex-col justify-start gap-4">
              <div className="flex flex-col">
                <h1 className="text-2xl">{eventData.type}</h1>
                <h2 className="text- xl">{eventData.name}</h2>
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
            <h2 className="text-xl">Qualified Teams</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-8">
              {eventData.event_participants.map((participant) => (
                <Card key={participant.team_id} shadow="sm">
                  <CardHeader
                    className="cursor-pointer whitespace-nowrap hover:underline"
                    onClick={() => {
                      router.push(`/esports/teams/${participant.team_id}`);
                    }}
                  >
                    {participant.teams.name}
                  </CardHeader>
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
                  <CardFooter>{participant.seeding}</CardFooter>
                </Card>
              ))}
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-col">
            <div>
              <h2>Matches</h2>
              <ul className="flex w-full flex-col justify-center gap-4">
                {eventData.matches.map((match) => {
                  const team1 = eventData.event_participants.find(
                    (participant) => match.team1_id === participant.team_id,
                  );

                  const team2 = eventData.event_participants.find(
                    (participant) => match.team2_id === participant.team_id,
                  );

                  return (
                    <li key={match.id} className="flex gap-4 p-4">
                      <div
                        className="flex flex-row items-center gap-4"
                        id="team1"
                      >
                        <Image
                          className="h-8 w-8"
                          classNames={{
                            img: "rounded-none",
                          }}
                          src={team1?.teams.logo_url}
                        />
                        <div>{team1?.teams.name}</div>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`p-1 text-black ${
                            match.team1_game_score > match.team2_game_score
                              ? "bg-[#6FEE8D]"
                              : "bg-[#ff7272]"
                          }`}
                        >
                          {match.team1_game_score}
                        </div>
                        <span>-</span>
                        <div
                          className={`p-1 text-black ${
                            match.team2_game_score > match.team1_game_score
                              ? "bg-[#6FEE8D]"
                              : "bg-[#ff7272]"
                          }`}
                        >
                          {match.team2_game_score}
                        </div>
                      </div>
                      <div
                        className="flex flex-row items-center gap-4"
                        id="team2"
                      >
                        <span>{team2?.teams.name}</span>
                        <Image
                          className="h-8 w-8"
                          classNames={{
                            img: "rounded-none",
                          }}
                          src={team2?.teams.logo_url}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardFooter>
        </Card>
      )}
    </section>
  );
};

export default EventPage;
