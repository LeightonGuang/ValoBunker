"use client";

import { useEffect, useState } from "react";
import { Image, Accordion, AccordionItem } from "@nextui-org/react";

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

      if (countdownEventList) {
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdownEventList]);

  return (
    <Accordion
      defaultExpandedKeys={[`${countdownEventList[0].id}`]}
      selectionMode="multiple"
      variant="shadow"
    >
      {countdownEventList.map((event) => {
        const endDate = new Date(event.end_date);
        const currentTime = new Date(currentDateTime).getTime();

        const americaTimeDifference =
          new Date(
            endDate.getTime() + americaOffset * 60 * 60 * 1000,
          ).getTime() - currentTime;

        const asiaTimeDifference =
          new Date(endDate.getTime() + asiaOffset * 60 * 60 * 1000).getTime() -
          currentTime;

        const europeTimeDifference = endDate.getTime() - currentTime;

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
                className="h-8 w-8 rounded-none object-cover"
                src={event.img_url}
              />
            }
            textValue={event.name}
            title={<span className="text-lg">{event.name}</span>}
          >
            {event.is_same_time ? (
              <div className="flex flex-col">
                <span className="text-sm font-medium">All regions</span>
                <span className="font-semibold">
                  {formattedTime(europeTimeDifference)}
                </span>
              </div>
            ) : (
              <ul className="flex flex-col">
                <li className="flex flex-col">
                  <span className="text-sm font-medium">America</span>
                  <span className="flex items-center gap-2 font-semibold">
                    {formattedTime(americaTimeDifference)}
                    <span className="text-small text-default-400">
                      {americaOffset}h
                    </span>
                  </span>
                </li>

                <li className="flex flex-col">
                  <span className="text-sm font-medium">Asia</span>
                  <span className="flex items-center gap-2 font-semibold">
                    {formattedTime(asiaTimeDifference)}
                    <span className="text-small text-default-400">
                      {asiaOffset}h
                    </span>
                  </span>
                </li>

                <li className="flex flex-col">
                  <span className="text-sm font-medium">Europe</span>
                  <span className="font-semibold">
                    {formattedTime(europeTimeDifference)}
                  </span>
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
