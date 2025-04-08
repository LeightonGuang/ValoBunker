"use client";

import {
  Card,
  Form,
  Image,
  Input,
  Button,
  Switch,
  CardBody,
  CardHeader,
  DatePicker,
} from "@heroui/react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import React, { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { CountdownTableType } from "@/types/CountdownTableType";
import { getSupabase } from "@/utils/supabase/client";
const CreateCountdownPage = () => {
  const [countdownData, setCountdownData] = useState<CountdownTableType>(
    {} as CountdownTableType,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const supabase = getSupabase();

      const { error } = await supabase
        .from("countdown")
        .insert([countdownData]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountdownData({
      ...countdownData,
      [e.target.name]: e.target.value,
    } as CountdownTableType);
  };

  useEffect(() => {
    console.log(countdownData);
  }, [countdownData]);

  return (
    <section>
      <div className="mt-6 flex justify-center gap-2">
        <Card className="w-96">
          <CardHeader>
            <h1 className={title()}>Create Countdown</h1>
          </CardHeader>

          <CardBody>
            <Image
              alt={countdownData.name}
              className="aspect-auto h-auto w-full rounded-none"
              src={countdownData.img_url}
            />

            <Form
              aria-label="Edit Countdown"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                isRequired
                label="URL"
                name="img_url"
                value={countdownData.img_url}
                onChange={onFormChange}
              />

              <Input
                isRequired
                label="Name"
                name="name"
                value={countdownData.name}
                onChange={onFormChange}
              />

              <Switch
                isSelected={countdownData.is_same_time}
                onValueChange={() => {
                  setCountdownData({
                    ...countdownData,
                    is_same_time: !countdownData.is_same_time,
                  });
                }}
              >
                Same time for all region
              </Switch>

              <DatePicker
                isRequired
                granularity="second"
                label="Start Date"
                name="start_date"
                value={
                  countdownData.start_date
                    ? parseAbsoluteToLocal(String(countdownData.start_date))
                    : undefined
                }
                onChange={(value: any) => {
                  const isoDate = value
                    .toDate(getLocalTimeZone())
                    .toISOString();

                  setCountdownData((prev) => ({
                    ...prev,
                    start_date: isoDate as unknown as Date,
                  }));
                }}
              />

              <DatePicker
                isRequired
                granularity="second"
                label="End Date"
                name="end_date"
                value={
                  countdownData.start_date
                    ? parseAbsoluteToLocal(String(countdownData.end_date))
                    : undefined
                }
                onChange={(value: any) => {
                  const isoDate = value
                    .toDate(getLocalTimeZone())
                    .toISOString();

                  setCountdownData((prev) => ({
                    ...prev,
                    end_date: isoDate as unknown as Date,
                  }));
                }}
              />

              <Button className="w-full" color="primary" type="submit">
                Update
              </Button>
            </Form>
          </CardBody>
        </Card>

        <div>tips</div>
      </div>
    </section>
  );
};

export default CreateCountdownPage;
