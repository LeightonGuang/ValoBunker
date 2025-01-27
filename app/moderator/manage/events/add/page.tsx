"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Image,
  Input,
} from "@heroui/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";

interface AddEventFormType {
  event_icon_url?: string;
  type: string;
  name: string;
  start_date?: string;
  end_date?: string;
  prize_pool?: string;
  location: string;
}

const AddEventPage = () => {
  const [addEventForm, setAddEventForm] = useState<AddEventFormType>({
    event_icon_url: "",
    type: "",
    name: "",
    start_date: "",
    end_date: "",
    location: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const onAddEventFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setAddEventForm({
      ...addEventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddEventFormSubmit = async () => {
    try {
      const newEventForm = { ...addEventForm };

      if (newEventForm.start_date === "") {
        delete newEventForm.start_date;
      }

      if (newEventForm.end_date === "") {
        delete newEventForm.end_date;
      }

      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("events")
        .insert([newEventForm]);

      if (error) {
        console.error(error);
        setErrorMessage(error.message);
      } else {
        // console.log(data);
        router.push("/moderator/manage/events");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(addEventForm);
  }, [addEventForm]);

  return (
    <section>
      <Breadcrumbs aria-label="breadcrumb" className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/events">Events</BreadcrumbItem>
        <BreadcrumbItem>Add</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className={title()}>Add Event</h1>
      <div className="mt-6 flex justify-center">
        <Card className="w-96">
          <CardBody>
            <form className="flex flex-col gap-4">
              <div className="flex justify-center">
                <Image
                  className="max-h-40"
                  src={
                    addEventForm.event_icon_url === ""
                      ? "https://placehold.co/1920x1080"
                      : addEventForm.event_icon_url
                  }
                />
              </div>

              <Input
                label="Event Icon Url"
                name="event_icon_url"
                placeholder="Event Icon Url"
                type="text"
                onChange={onAddEventFormChange}
              />

              <Input
                isRequired
                label="Event Type"
                name="type"
                placeholder="eg. Champions, Masters, Game Changers"
                type="text"
                onChange={onAddEventFormChange}
              />

              <Input
                isRequired
                label="Event Name"
                name="name"
                placeholder="eg. Berlin, Reykjavík, 2024"
                type="text"
                onChange={onAddEventFormChange}
              />

              <Input
                label="Start Date"
                name="start_date"
                placeholder="Start Date"
                type="date"
                onChange={onAddEventFormChange}
              />

              <Input
                label="End Date"
                name="end_date"
                placeholder="End Date"
                type="date"
                onChange={onAddEventFormChange}
              />

              <Input
                label="Prize Pool"
                name="prize_pool"
                placeholder="eg. US$500,000"
                type="text"
                onChange={onAddEventFormChange}
              />

              <Input
                isRequired
                label="Location"
                name="location"
                placeholder="eg. Los Angeles, New York"
                type="text"
                onChange={onAddEventFormChange}
              />

              {errorMessage && (
                <div className="text-[#ff0000]">{errorMessage}</div>
              )}

              <div className="flex w-full justify-between gap-4">
                <Button className="w-full" color="danger" onClick={router.back}>
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  color="primary"
                  formAction={handleAddEventFormSubmit}
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default AddEventPage;
