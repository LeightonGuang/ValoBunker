"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Image,
  Divider,
  CardBody,
  Accordion,
  CardHeader,
  AccordionItem,
} from "@nextui-org/react";

import { CountdownTableType } from "@/types/CountdownTableType";

const timezones = {
  HKT: "Asia/Hong_Kong",
  PST: "America/Los_Angeles",
  GMT: "Etc/GMT",
} as { [key: string]: string };

const calculateCountdown: (endDate: Date, timeZone: string) => string = (
  endDate: Date,
  timeZone: string,
) => {
  endDate = new Date(endDate);

  const convertToTimezone = (date: Date, timeZone: string) => {
    const utcDate = date.getTime() + date.getTimezoneOffset() * 60000;
    const targetTimeZoneOffset = new Date(utcDate).toLocaleString("en-US", {
      timeZone,
    });

    return new Date(targetTimeZoneOffset);
  };

  const currentDateTime = convertToTimezone(new Date(), timezones[timeZone]);
  const difference = endDate.getTime() - currentDateTime.getTime();

  const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
  );
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const doubleDigits = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return months
    ? `${months}m, ${days}d, ${doubleDigits(hours)}:${doubleDigits(minutes)}:${doubleDigits(seconds)}`
    : `${days}d, ${doubleDigits(hours)}:${doubleDigits(minutes)}:${doubleDigits(seconds)}`;
};

const CountdownCard = ({
  countdownEventList,
}: {
  countdownEventList?: CountdownTableType[] | undefined;
}) => {
  const [times, setTimes] = useState<{
    [key: string]: { PST: string; GMT: string; HKT: string };
  }>({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdownEventList) {
        const updatedTimes: {
          [key: string]: { PST: string; GMT: string; HKT: string };
        } = {};

        countdownEventList.forEach((countdownObj) => {
          updatedTimes[countdownObj.name as any] = {
            PST: calculateCountdown(new Date(countdownObj.end_date), "PST"),
            GMT: calculateCountdown(new Date(countdownObj.end_date), "GMT"),
            HKT: calculateCountdown(new Date(countdownObj.end_date), "HKT"),
          };
        });

        setTimes(updatedTimes);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdownEventList]);

  return (
    <Card>
      <CardHeader>Countdown</CardHeader>

      <Divider />

      <CardBody>
        <Accordion
          defaultExpandedKeys={
            countdownEventList && [`${countdownEventList[0].id}`]
          }
        >
          {countdownEventList
            ? countdownEventList?.map((countdownEventObj) => {
                return (
                  <AccordionItem
                    key={countdownEventObj.id}
                    startContent={
                      <Image
                        alt={countdownEventObj.name}
                        className="h-8 w-8 rounded-none object-cover"
                        src={countdownEventObj.img_url}
                      />
                    }
                    title={countdownEventObj.name}
                  >
                    {
                      <div className="flex flex-col">
                        <span>
                          America: {times[countdownEventObj.name]?.PST}
                        </span>
                        <span>
                          Europe: {times[countdownEventObj.name]?.GMT}
                        </span>
                        <span>Asia: {times[countdownEventObj.name]?.HKT}</span>
                      </div>
                    }
                  </AccordionItem>
                );
              })
            : null}
        </Accordion>
      </CardBody>
    </Card>
  );
};

export default CountdownCard;
