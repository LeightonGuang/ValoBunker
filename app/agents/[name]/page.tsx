"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Avatar,
  Divider,
  Tooltip,
  CardBody,
  CardHeader,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { AgentsTableType } from "@/types/AgentsTableType";
import { AbilitiesTableType } from "@/types/AbilitiesTableType";

const AgentPage = () => {
  const agentName = useParams().name;
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<AgentsTableType>();

  const abilitiesOrder = ["C", "Q", "E", "X"];

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select(`*, abilities(*), roles(*)`)
        .eq("name", agentName)
        .single();

      if (agentError) {
        console.error(agentError);
      } else {
        console.log(agentData);
        setAgentData(agentData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const AgentCard = ({ className }: { className?: string }) => {
    const ability: (bind: string) => AbilitiesTableType | undefined = (
      bind: string,
    ) => agentData?.abilities.find((ability) => ability.key_bind === bind);

    const totalAbilityCost = agentData?.abilities
      ? agentData?.abilities.reduce(
          (total, ability) =>
            total +
            ability.cost * (ability.max_charge - ability.charges_on_spawn),
          0,
        )
      : 0;

    const CreditIcon = () => {
      return (
        <Avatar
          className="bg-transparent h-3 w-3 rounded-none text-tiny opacity-40"
          src="https://static.wikia.nocookie.net/valorant/images/8/81/Credits_icon.png"
        />
      );
    };

    const LightArmorIcon = ({ className }: { className?: string }) => {
      return (
        <Avatar
          className={`bg-transparent rounded-none ${className}`}
          src="https://static.wikia.nocookie.net/valorant/images/9/93/Light_Armor.png"
        />
      );
    };

    const HeavyArmorIcon = ({ className }: { className?: string }) => {
      return (
        <Avatar
          className={`bg-transparent rounded-none ${className}`}
          src="https://static.wikia.nocookie.net/valorant/images/6/62/Heavy_Armor.png"
        />
      );
    };

    const AgentInfo = () => {
      return (
        <div className="grid w-full grid-cols-2 items-center">
          <Avatar
            alt={agentData?.name}
            className="bg-transparent h-32 min-h-32 w-32 min-w-32 rounded-none"
            src={agentData?.icon_url}
          />

          <div className="flex flex-col gap-1">
            <span className="text-large">{agentData?.name}</span>

            <span className="flex items-center gap-2 text-tiny">
              <Avatar
                alt={agentData?.roles.name}
                className="bg-transparent h-4 w-4 rounded-none"
                src={agentData?.roles.icon_url}
              />
              <span>{agentData?.roles.name}</span>
            </span>

            <span className="text-tiny text-default-400">
              Release Date:{" "}
              {new Intl.DateTimeFormat().format(
                new Date(agentData?.release_date ?? ""),
              )}
            </span>
          </div>
        </div>
      );
    };

    const AgentDetails = () => {
      return (
        <>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-large">Abilities</span>
              <p className="text-tiny text-default-400">
                *Highted abilities can regenerate
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              {abilitiesOrder.map((bind, i) => {
                const selectedAbility = ability(bind);

                return (
                  <div key={bind} className={`flex items-center gap-2`}>
                    <div
                      className={`rounded-md p-1 ${selectedAbility?.regen && "bg-default-100"}`}
                    >
                      <Tooltip
                        key={bind}
                        content={
                          <span className="text-tiny">
                            {selectedAbility?.name}
                          </span>
                        }
                      >
                        <div className="flex w-full flex-col items-center text-center">
                          <Image
                            alt={ability(bind)?.name}
                            className="flex h-8 w-8 flex-col rounded-none"
                            src={ability(bind)?.icon_url}
                          />

                          <div className="my-2 flex h-3 max-w-7 flex-wrap items-center justify-center gap-1">
                            {bind !== "X"
                              ? Array.from({
                                  length: ability(bind)?.max_charge ?? 0,
                                }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="h-1 w-1 rounded-full bg-foreground"
                                  />
                                ))
                              : Array.from({
                                  length: ability(bind)?.ult_points ?? 0,
                                }).map((_, i) => (
                                  <div key={i} className="relative h-1 w-1">
                                    <div className="absolute inset-0 rotate-45 transform bg-foreground" />
                                  </div>
                                ))}
                          </div>

                          <span className="w-min">{bind}</span>
                        </div>
                      </Tooltip>
                    </div>

                    {i < abilitiesOrder.length - 1 && (
                      <Divider className="w-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Divider className="my-3" />

          <div className="flex flex-col gap-4">
            {abilitiesOrder.map((bind) => {
              const selectedAbility = ability(bind);

              return (
                <div key={bind} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Avatar
                      alt={selectedAbility?.name}
                      className="bg-transparent h-6 w-6 rounded-none"
                      src={selectedAbility?.icon_url}
                    />

                    <span className="text-medium">{selectedAbility?.name}</span>

                    <span className="text-tiny text-default-400">
                      {selectedAbility?.cost
                        ? selectedAbility?.cost
                        : selectedAbility?.cost === 0
                          ? "Free"
                          : selectedAbility?.cost === null
                            ? `${selectedAbility?.ult_points ?? "x"} ult points`
                            : ""}
                    </span>
                  </div>

                  <div className="flex gap-4 text-default-600">
                    {selectedAbility?.cooldown && (
                      <span>{`Cooldown: ${selectedAbility?.cooldown ? `${selectedAbility?.cooldown}s` : "x"}`}</span>
                    )}
                    {selectedAbility?.regen && (
                      <span>{`Regen: ${selectedAbility?.regen ? `${selectedAbility?.regen}s` : "x"}`}</span>
                    )}
                  </div>

                  <p className="rounded-md bg-default-100 p-1 text-tiny text-default-600">
                    {selectedAbility?.description}
                  </p>
                </div>
              );
            })}
          </div>

          <Divider className="my-3" />

          <div>
            <h2 className="mb-2 text-large">Minimum Credit Required</h2>

            <ul className="flex flex-col gap-1">
              {[
                {
                  title: "Light Armor with Vandal / Phantom",
                  cost: totalAbilityCost + 2900 + 400,
                  iconList: [<LightArmorIcon key={0} className="h-6 w-6" />],
                },
                {
                  title: "Heavy Armor with Vandal / Phantom",
                  cost: totalAbilityCost + 2900 + 1000,
                  iconList: [<HeavyArmorIcon key={0} className="h-6 w-6" />],
                },
                {
                  title: "Light Armor with Vandal / Phantom",
                  cost: totalAbilityCost + 4700 + 400,
                  iconList: [<LightArmorIcon key={0} className="h-6 w-6" />],
                },
                {
                  title: "Heavy Armor with Vandal / Phantom",
                  cost: totalAbilityCost + 4700 + 1000,
                  iconList: [<HeavyArmorIcon key={0} className="h-6 w-6" />],
                },
              ].map((buy, i) => {
                return (
                  <li key={i} className="flex items-center justify-between">
                    <h3 className="text-medium">
                      {buy.title}

                      <div className="mt-1 flex gap-2">
                        {buy.iconList.map((icon) => icon)}

                        <span className="text-medium">+</span>

                        <Avatar
                          className="bg-transparent h-6 w-6 rounded-none"
                          src={ability("C")?.icon_url}
                        />

                        <span className="text-medium">+</span>

                        <Avatar
                          className="bg-transparent h-6 w-6 rounded-none"
                          src={ability("Q")?.icon_url}
                        />
                      </div>
                    </h3>

                    <span className="flex items-center gap-1 text-tiny text-default-400">
                      <CreditIcon />
                      {buy.cost}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      );
    };

    return (
      <Card className={className}>
        <CardHeader className="flex justify-between">
          <AgentInfo />
        </CardHeader>

        <Divider />

        <CardBody>
          <AgentDetails />
        </CardBody>
      </Card>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="flex justify-center">
      {!isLoading && (
        <div className="w-full">
          <Breadcrumbs>
            <BreadcrumbItem href="/agents">Agents</BreadcrumbItem>
            <BreadcrumbItem>{agentData?.name}</BreadcrumbItem>
          </Breadcrumbs>

          <div className="flex justify-center">
            <AgentCard className="mt-4 w-96 lg:w-[50rem]" />
          </div>
        </div>
      )}
    </section>
  );
};

export default AgentPage;
