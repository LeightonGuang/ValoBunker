"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  User,
  Input,
  Image,
  Button,
  Select,
  CardBody,
  SelectItem,
  Breadcrumbs,
  SelectedItems,
  BreadcrumbItem,
} from "@heroui/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { TeamsTableType } from "@/types/TeamsTableType";
import { EventsTableType } from "@/types/EventsTableType";

const EditEventPage = () => {
  const eventId = useParams().id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [eventForm, setEventForm] = useState<EventsTableType | null>(null);
  const [teams, setTeams] = useState<TeamsTableType[]>([]);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select(`*`)
        .eq("id", eventId);

      if (eventError) {
        console.error(eventError);
      } else {
        // console.log(data[0]);
        setEventForm(eventData[0]);
      }

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*, vct_league(*)")
        .order("name", { ascending: true });

      if (teamsError) {
        console.error(teamsError);
      } else {
        console.log(teamsData);
        setTeams(teamsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEventFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!eventForm) return;

    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEventUpdateSubmit = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .update(eventForm)
        .eq("id", eventId)
        .select();

      if (error) {
        console.error(error);
      } else {
        router.push("/moderator/manage/events");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full lg:mr-4">
      <Breadcrumbs aria-label="breadcrumb">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/events">Events</BreadcrumbItem>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className={title()}>Edit Event</h1>

      <div className="mt-6 flex justify-center">
        {!isLoading && eventForm && (
          <Card className="w-96">
            <CardBody>
              <form className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <Image
                    alt={eventForm?.name}
                    className="max-h-40"
                    src={
                      eventForm?.event_icon_url ||
                      "https://placehold.co/1920x1080"
                    }
                  />
                </div>

                <label htmlFor="event_icon_url">
                  Event Icon Url
                  <Input
                    name="event_icon_url"
                    placeholder="Event Icon Url"
                    type="text"
                    value={eventForm?.event_icon_url}
                    onChange={onEventFormChange}
                  />
                </label>

                <label htmlFor="type">
                  Type
                  <Input
                    name="type"
                    placeholder="eg, Champions, Masters"
                    type="text"
                    value={eventForm?.type}
                    onChange={onEventFormChange}
                  />
                </label>

                <label htmlFor="name">
                  Name
                  <Input
                    name="name"
                    placeholder="Event Name"
                    type="text"
                    value={eventForm?.name}
                    onChange={onEventFormChange}
                  />
                </label>

                <label htmlFor="start_date">
                  Start Date
                  <Input
                    name="start_date"
                    placeholder="Start Date"
                    type="date"
                    value={eventForm?.start_date}
                    onChange={onEventFormChange}
                  />
                </label>

                <label htmlFor="end_date">
                  End Date
                  <Input
                    name="end_date"
                    placeholder="End Date"
                    type="date"
                    value={eventForm?.end_date}
                    onChange={onEventFormChange}
                  />
                </label>

                <label htmlFor="">
                  Participating Teams
                  <Select
                    isMultiline={true}
                    items={teams}
                    placeholder="Select participating teams"
                    renderValue={(teams: SelectedItems<TeamsTableType>) => (
                      <div className="flex flex-wrap gap-4 p-2">
                        {teams.map((team) => (
                          <User
                            key={team.data?.id}
                            avatarProps={{
                              src: team.data?.logo_url,
                              className: "bg-transparent rounded-none",
                            }}
                            name={team.data?.name}
                          />
                        ))}
                      </div>
                    )}
                    selectionMode="multiple"
                  >
                    {(team) => (
                      <SelectItem key={team.id}>
                        <User
                          avatarProps={{
                            src: team.logo_url,
                            className: "bg-transparent rounded-none",
                          }}
                          description={team.vct_league.name}
                          name={team.name}
                        />
                      </SelectItem>
                    )}
                  </Select>
                </label>

                <label htmlFor="prize_pool">
                  Prize Pool
                  <Input
                    name="prize_pool"
                    placeholder="Prize Pool"
                    type="text"
                    value={eventForm?.prize_pool}
                    onChange={onEventFormChange}
                  />
                </label>

                <label htmlFor="location">
                  Location
                  <Input
                    name="location"
                    placeholder="Location"
                    type="text"
                    value={eventForm?.location}
                    onChange={onEventFormChange}
                  />
                </label>

                <div className="flex w-full justify-between gap-4">
                  <Button
                    className="w-full"
                    color="danger"
                    onClick={() => router.push("/moderator/manage/events")}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full"
                    color="primary"
                    formAction={handleEventUpdateSubmit}
                    type="submit"
                  >
                    Update
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
        {isLoading && <p>Loading...</p>}
      </div>
    </section>
  );
};

export default EditEventPage;
