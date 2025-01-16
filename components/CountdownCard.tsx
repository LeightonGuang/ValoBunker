"use client";

import { useEffect, useState } from "react";
import { Image, Accordion, AccordionItem, Progress } from "@nextui-org/react";

import { CountdownTableType } from "@/types/CountdownTableType";

const CountdownCard = ({
  countdownEventList,
}: {
  countdownEventList: CountdownTableType[];
}) => {
  const americaOffset = -14;
  const asiaOffset = -6;

  const [currentDateTime, setCurrentDateTime] = useState<string>(
    new Date().toLocaleString("en-US", { timeZone: "Europe/London" }),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/London",
      });

      setCurrentDateTime(currentTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Accordion
      defaultExpandedKeys={[`${countdownEventList[0]?.id}`]}
      selectionMode="multiple"
      variant="shadow"
    >
      {countdownEventList.map((event) => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const currentDate = new Date(currentDateTime);

        if (currentDate < startDate || currentDate > endDate) {
          return null;
        }

        const americaTimeDifference =
          new Date(
            endDate.getTime() + americaOffset * 60 * 60 * 1000,
          ).getTime() - currentDate.getTime();

        const asiaTimeDifference =
          new Date(endDate.getTime() + asiaOffset * 60 * 60 * 1000).getTime() -
          currentDate.getTime();

        const europeTimeDifference = endDate.getTime() - currentDate.getTime();

        const formattedTime = (difference: number) => {
          const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
          const days = Math.floor(
            (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
          );
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          const doubleDigits = (num: number) => {
            return num.toString().padStart(2, "0");
          };

          return months
            ? `${months}m, ${days}d, ${doubleDigits(hours)}:${doubleDigits(minutes)}:${doubleDigits(seconds)}`
            : `${days}d, ${doubleDigits(hours)}:${doubleDigits(minutes)}:${doubleDigits(seconds)}`;
        };

        return (
          <AccordionItem
            key={event.id}
            startContent={
              <Image
                alt={event.name}
                className="h-8 rounded-md object-cover"
                src={event.img_url}
              />
            }
            textValue={event.name}
            title={<span className="text-medium">{event.name}</span>}
          >
            {event.is_same_time ? (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-small font-medium">All regions</span>
                  <span className="text-tiny text-default-400">
                    {endDate.toLocaleString()}
                  </span>
                </div>

                <Progress
                  aria-label={event.name}
                  color="primary"
                  label={
                    <span className="text-medium font-semibold">
                      {formattedTime(europeTimeDifference)}
                    </span>
                  }
                  size="sm"
                  value={
                    (europeTimeDifference /
                      (endDate.getTime() - startDate.getTime())) *
                    100
                  }
                />
              </div>
            ) : (
              <ul className="flex flex-col">
                <li className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-medium">America</span>
                    <span className="text-tiny text-default-400">
                      {new Date(
                        endDate.getTime() + americaOffset * 60 * 60 * 1000,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    aria-label={event.name}
                    color="primary"
                    label={
                      <div className="flex items-center gap-2 text-medium font-semibold">
                        {formattedTime(americaTimeDifference)}
                        <span className="text-small text-default-400">
                          {americaOffset}h
                        </span>
                      </div>
                    }
                    size="sm"
                    value={
                      (americaTimeDifference /
                        (endDate.getTime() - startDate.getTime())) *
                      100
                    }
                  />
                </li>

                <li className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-medium">Asia</span>
                    <span className="text-tiny text-default-400">
                      {new Date(
                        endDate.getTime() + asiaOffset * 60 * 60 * 1000,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    aria-label={event.name}
                    color="primary"
                    label={
                      <div className="flex items-center gap-2 text-medium font-semibold">
                        {formattedTime(asiaTimeDifference)}
                        <span className="text-small text-default-400">
                          {asiaOffset}h
                        </span>
                      </div>
                    }
                    size="sm"
                    value={
                      (asiaTimeDifference /
                        (endDate.getTime() - startDate.getTime())) *
                      100
                    }
                  />
                </li>

                <li className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-medium">Europe</span>
                    <span className="text-tiny text-default-400">
                      {endDate.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    aria-label={event.name}
                    color="primary"
                    label={
                      <span className="text-medium font-semibold">
                        {formattedTime(europeTimeDifference)}
                      </span>
                    }
                    size="sm"
                    value={
                      (europeTimeDifference /
                        (endDate.getTime() - startDate.getTime())) *
                      100
                    }
                  />
                </li>
              </ul>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CountdownCard;
