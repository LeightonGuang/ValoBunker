"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Tab,
  Tabs,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import teamsData from "../../../public/data/teamsData.json";

import { title } from "@/components/primitives";
import { ListIcon } from "@/components/icons";

const regionList: { region: string; region_icon_url: string }[] = [
  {
    region: "Americas",
    region_icon_url: "https://owcdn.net/img/640f5ab71dfbb.png",
  },
  {
    region: "China",
    region_icon_url: "https://owcdn.net/img/65dd97cea9a25.png",
  },
  {
    region: "EMEA",
    region_icon_url: "https://owcdn.net/img/65ab54a77831c.png",
  },
  {
    region: "Pacific",
    region_icon_url: "https://owcdn.net/img/640f5ae002674.png",
  },
];

const TeamsPage = () => {
  return (
    <section>
      <div>
        <h1 className={title()}>Teams</h1>
      </div>
      <div>
        <Tabs
          className="mt-4 flex justify-center"
          classNames={{
            tab: "max-w-fit",
          }}
        >
          {Object.values(teamsData).map((regionData, i) => (
            <Tab
              key={regionList[i].region}
              className="h-full w-full"
              title={
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <Image
                    unoptimized
                    alt={regionList[i].region}
                    className="h-4 w-4"
                    height={16}
                    src={regionList[i].region_icon_url}
                    width={16}
                  />
                  {regionList[i].region}
                </div>
              }
            >
              <Card className="mt-6 w-min lg:hidden">
                <CardHeader>
                  Contents <ListIcon className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardBody>
                  <ul className="list-decimal text-sm text-default-500 marker:text-default-500">
                    {regionData.map((teamObj) => (
                      <li key={teamObj.id} className="w-max">
                        <Link
                          className="hover:underline"
                          href={`#teamsPage__${regionList[i]}--${teamObj.id}`}
                        >
                          {teamObj.team_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
              <div className="mt-4 flex flex-col gap-16 py-4 lg:snap-x lg:snap-mandatory lg:flex-row lg:flex-nowrap lg:gap-8 lg:overflow-x-scroll">
                {regionData.map((teamObj) => (
                  <Card
                    key={teamObj.id}
                    className="lg:w-[calc(25%-1.5rem)] lg:flex-shrink-0 lg:snap-start"
                    id={`teamsPage__${regionList[i]}--${teamObj.id}`}
                  >
                    <CardHeader>
                      <Image
                        unoptimized
                        alt={teamObj.team_name}
                        className="[0.875rem] mr-4 rounded-md"
                        height={64}
                        src={teamObj.team_logo_url}
                        width={64}
                      />
                      <h2 className="text-xl font-bold">{teamObj.team_name}</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <h2>Main Roster</h2>
                      <ul className="mt-4 flex list-disc flex-col gap-4">
                        {teamObj.roster.map((player, i) => (
                          <li key={player.id} className="flex">
                            <Button className="flex h-full w-full p-2">
                              <Avatar
                                className="ml-[0.625rem] min-w-[2.5rem] bg-[#ffffff]"
                                color="primary"
                                isBordered={i === 0}
                                size="md"
                                src={player.profile_picture_url}
                              />
                              <div className="ml-[1.25rem] flex w-full flex-col text-left">
                                <p className="text-[1rem]">{player.ign}</p>
                                <p className="text-[0.8rem] text-default-500">
                                  {player.name}
                                </p>
                                <p className="text-[0.8rem] text-default-500">
                                  {player.role}
                                </p>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Button className="flex h-full w-full justify-between p-2">
                        <Avatar
                          className="ml-[0.625rem] min-w-[2.5rem] bg-[#ffffff]"
                          src={teamObj.head_coach.profile_picture_url}
                        />
                        <div className="ml-[1.25rem] flex w-full flex-col text-left">
                          <p>{teamObj.head_coach.ign}</p>
                          <p className="text-[0.8rem] text-default-500">
                            {teamObj.head_coach.name}
                          </p>
                          <p className="text-[0.8rem] text-default-500">
                            Head Coach
                          </p>
                        </div>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default TeamsPage;
