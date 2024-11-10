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

import teamsData from "../../../public/data/teamsData.json";

import { title } from "@/components/primitives";

const TeamsPage = () => {
  return (
    <section>
      <div>
        <h1 className={title()}>Teams</h1>
      </div>
      <div>
        <Tabs className="mt-4 flex justify-end">
          <Tab title="Americas">
            <div className="mt-6 flex flex-col gap-16 py-4 lg:flex-row lg:flex-nowrap lg:gap-8 lg:overflow-x-scroll">
              {teamsData.americasTeamsData.map((teamObj) => (
                <Card key={teamObj.id} className="lg:w-80 lg:min-w-80">
                  <CardHeader>
                    <Image
                      unoptimized
                      alt={teamObj.team_name}
                      className="[0.875rem] mr-4 rounded-md"
                      height={64}
                      src={teamObj.team_logo_url}
                      width={64}
                    />
                    {teamObj.team_name}
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <h2>Main Roster</h2>

                    <ul className="mt-4 flex list-disc flex-col gap-4">
                      {teamObj.roster.map((player, i) => (
                        <li key={player.id} className="flex items-center gap-4">
                          <Button className="flex h-full w-full justify-between p-2">
                            <Avatar
                              className="min-w-[2.5rem] bg-[#ffffff]"
                              color="primary"
                              isBordered={i === 0}
                              size="md"
                              src={player.profile_picture_url}
                            />
                            <div className="flex w-full flex-col">
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
                        className={`min-w-[2.5rem] bg-[#ffffff]`}
                        src={teamObj.head_coach.profile_picture_url}
                      />
                      <div className="flex w-full flex-col">
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
          <Tab title="China">
            <div></div>
          </Tab>
          <Tab title="EMEA">
            <div></div>
          </Tab>
          <Tab title="Pacific">
            <div></div>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};

export default TeamsPage;
