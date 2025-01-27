"use client";

import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  CardBody,
  CardHeader,
  DatePicker,
  Image,
} from "@heroui/react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { CountdownTableType } from "@/types/CountdownTableType";

const EditCountdownPage = () => {
  const router = useRouter();
  const countdownId = useParams().id;
  const [isloading, setIsLoading] = useState(false);
  const [countdownData, setCountdownData] = useState<CountdownTableType>(
    {} as CountdownTableType,
  );

  const fetchData = async () => {
    try {
      const supabase = getSupabase();

      const { data: countdownData, error: countdownError } = await supabase
        .from("countdown")
        .select("*")
        .eq("id", countdownId)
        .single();

      if (countdownError) {
        console.error(countdownError);
      } else {
        setCountdownData(countdownData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountdownData({
      ...countdownData,
      [e.target.name]: e.target.value,
    } as CountdownTableType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = getSupabase();

      const { error } = await supabase
        .from("countdown")
        .update({
          img_url: countdownData.img_url,
          name: countdownData.name,
          is_same_time: countdownData.is_same_time,
          start_date: countdownData.start_date,
          end_date: countdownData.end_date,
        })
        .eq("id", countdownId);

      if (error) {
        console.error(error);
        alert("Failed to update countdown");

        return;
      } else {
        router.push("/moderator/manage/countdown");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <div className="mt-6 flex justify-center">
        {!isloading && (
          <Card className="w-96">
            <CardHeader>
              <h1 className={title()}>Edit Countdown</h1>
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
        )}
      </div>
    </section>
  );
};

export default EditCountdownPage;
