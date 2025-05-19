"use client";

import {
  Card,
  Form,
  Image,
  Input,
  Radio,
  Button,
  CardBody,
  CardHeader,
  DatePicker,
  RadioGroup,
} from "@heroui/react";
import {
  CalendarDate,
  ZonedDateTime,
  CalendarDateTime,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import React, { useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { CountdownTableType } from "@/types/CountdownTableType";

const CreateCountdownPage = () => {
  const [countdownData, setCountdownData] = useState<CountdownTableType>({
    start_date: null,
    end_date: null,
  } as CountdownTableType);
  const [selectedCountdownType, setSelectedCountdownType] =
    useState<string>("season");

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountdownData({
      ...countdownData,
      [e.target.name]: e.target.value,
    } as CountdownTableType);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const supabase = getSupabase();

      const updatedCountdownData: CountdownTableType = {
        ...countdownData,
        is_same_time:
          selectedCountdownType === "bundle" ||
          selectedCountdownType === "night market"
            ? true
            : false,
      };

      const { error } = await supabase
        .from("countdown")
        .insert([updatedCountdownData])
        .select();

      if (error) {
        throw error;
      }
    } catch (error) {
  error(error);
    }
  };

  const handleStartDateChange = (
    value: ZonedDateTime | CalendarDate | CalendarDateTime | null,
  ) => {
    if (value) {
      const isoDate = value.toDate(getLocalTimeZone()).toISOString();
      const formattedDate = new Date(isoDate);

      setCountdownData((prev) => ({
        ...prev,
        start_date: formattedDate,
      }));
    }
  };

  const handleEndDateChange = (
    value: ZonedDateTime | CalendarDate | CalendarDateTime | null,
  ) => {
    if (value) {
      const isoDate = value.toDate(getLocalTimeZone()).toISOString();
      const formattedDate = new Date(isoDate);

      setCountdownData((prev) => ({
        ...prev,
        end_date: formattedDate,
      }));
    }
  };

  return (
    <section>
      <div className="mt-6 flex justify-center gap-4">
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
                label="Image URL"
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

              <RadioGroup
                color="primary"
                label="Select countdown type"
                orientation="horizontal"
                value={selectedCountdownType}
                onValueChange={setSelectedCountdownType}
              >
                <Radio value="season">Season</Radio>
                <Radio value="bundle">Bundle</Radio>
                <Radio value="night market">Night Market</Radio>
              </RadioGroup>

              <DatePicker
                isRequired
                granularity="second"
                label="Start Date"
                name="start_date"
                value={
                  countdownData.start_date instanceof Date &&
                  typeof countdownData.start_date.toISOString === "function"
                    ? parseAbsoluteToLocal(
                        countdownData.start_date.toISOString(),
                      )
                    : undefined
                }
                onChange={handleStartDateChange}
              />

              <p>
                Selected date:
                {countdownData.start_date
                  ? countdownData.start_date.toLocaleString()
                  : "No date selected"}
              </p>

              <DatePicker
                isRequired
                granularity="second"
                label="End Date"
                name="end_date"
                value={
                  countdownData.end_date instanceof Date &&
                  typeof countdownData.end_date.toISOString === "function"
                    ? parseAbsoluteToLocal(countdownData.end_date.toISOString())
                    : undefined
                }
                onChange={handleEndDateChange}
              />

              <Button className="w-full" color="primary" type="submit">
                Update
              </Button>
            </Form>
          </CardBody>
        </Card>

        <div className="w-40">
          <h1>tips</h1>

          <p>
            Season usually starts at 12am and ends anytime from 1am to 3am. It
            is also different for different regions
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateCountdownPage;
