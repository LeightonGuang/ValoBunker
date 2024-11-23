"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, CardBody, Image, Input } from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { EventsTableType } from "@/types/EventsTableType";

const EditEventPage = () => {
  const eventId = useParams().id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [eventForm, setEventForm] = useState<EventsTableType | null>(null);

  const fetchEventById = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`*`)
        .eq("id", eventId);

      if (error) {
        console.error(error);
      } else {
        // console.log(data[0]);
        setEventForm(data[0]);
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
    fetchEventById();
  }, []);

  return (
    <section>
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
