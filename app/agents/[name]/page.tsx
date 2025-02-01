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
} from "@heroui/react";

import { getSupabase } from "@/utils/supabase/client";
import { AgentsTableType } from "@/types/AgentsTableType";
import { WeaponsTableType } from "@/types/WeaponsTableType";
import { AbilitiesTableType } from "@/types/AbilitiesTableType";

const AgentPage = () => {
  const agentName = useParams().name;
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<AgentsTableType>(
    {} as AgentsTableType,
  );
  const [weaponsData, setWeaponsData] = useState<WeaponsTableType[]>([]);

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
        setAgentData(agentData);
      }

      const { data: weaponsData, error: weaponsError } = await supabase
        .from("weapons")
        .select("*")
        .in("id", [12, 13, 16]);

      if (weaponsError) {
        console.error(weaponsError);
      } else {
        setWeaponsData(weaponsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const AgentCard = ({ className }: { className?: string }) => {
    const ability: (bind: string) => AbilitiesTableType = (bind: string) =>
      agentData?.abilities.find((ability) => ability.key_bind === bind)!;

    const totalAbilityCost = agentData?.abilities
      ? agentData?.abilities.reduce(
          (total, ability) =>
            total +
            ability.cost * (ability.max_charge - ability.charges_on_spawn),
          0,
        )
      : 0;

    const CreditIcon = ({ className }: { className?: string }) => {
      return (
        <Avatar
          className={`bg-transparent h-3 w-3 rounded-none opacity-40 ${className}`}
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

              <div className="flex w-full justify-evenly">
                <p className="text-tiny text-default-500">
                  *Regenerates after cooldown
                </p>

                <p className="text-tiny text-radianite">*Free ability</p>

                <p className="text-tiny text-blue">*Regenerates on kills</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {abilitiesOrder.map((bind, i) => {
                const selectedAbility = ability(bind);

                return (
                  <div key={bind} className={`flex items-center gap-2`}>
                    <div
                      className={`rounded-md p-1 ${selectedAbility?.deploy_cooldown && "bg-default-100"} ${selectedAbility?.regen_on_kills && "border-1 border-blue"}`}
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
                                    className={`h-1 w-1 rounded-full ${(ability(bind)?.charges_on_spawn ?? 0) > i ? "bg-radianite" : "bg-foreground"} `}
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
                    <span className="flex gap-1 text-medium">
                      <Avatar
                        alt={selectedAbility?.name}
                        className="bg-transparent h-6 w-6 rounded-none"
                        src={selectedAbility?.icon_url}
                      />
                      {selectedAbility?.name}
                    </span>

                    <span className="text-tiny text-default-400">
                      {selectedAbility?.cost ? (
                        <div className="flex items-center gap-1">
                          <CreditIcon className="h-2 w-2" />
                          {selectedAbility?.cost}
                        </div>
                      ) : selectedAbility?.cost === 0 ? (
                        "Free"
                      ) : selectedAbility?.cost === null ? (
                        `${selectedAbility?.ult_points ?? "x"} ult points`
                      ) : (
                        ""
                      )}
                    </span>
                  </div>

                  <div className="flex gap-4 text-default-600">
                    {selectedAbility?.recall_cooldown && (
                      <span>{`Recall Cooldown: ${selectedAbility?.recall_cooldown ? `${selectedAbility?.recall_cooldown}s` : "x"}`}</span>
                    )}
                    {selectedAbility?.deploy_cooldown && (
                      <span>{`Deploy Cooldown: ${selectedAbility?.deploy_cooldown ? `${selectedAbility?.deploy_cooldown}s` : "x"}`}</span>
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
                  title: "Light Armor with Phantom / Vandal",
                  cost: totalAbilityCost + 2900 + 400,
                  armor: <LightArmorIcon className="h-6 w-6 min-w-6" />,
                  weaponsId: [12, 13],
                },
                {
                  title: "Heavy Armor with Phantom / Vandal",
                  cost: totalAbilityCost + 2900 + 1000,
                  armor: <HeavyArmorIcon className="h-6 w-6 min-w-6" />,
                  weaponsId: [12, 13],
                },
                {
                  title: "Light Armor with Operator",
                  cost: totalAbilityCost + 4700 + 400,
                  armor: <LightArmorIcon className="h-6 w-6" />,
                  weaponsId: [16],
                },
                {
                  title: "Heavy Armor with Operator",
                  cost: totalAbilityCost + 4700 + 1000,
                  armor: <HeavyArmorIcon className="h-6 w-6" />,
                  weaponsId: [16],
                },
              ].map((buy, i) => {
                return (
                  <li key={i}>
                    <div className="flex w-full justify-between">
                      <h3 className="text-medium">{buy.title}</h3>

                      <span className="flex items-center gap-1 text-small text-default-400">
                        <CreditIcon className="h-3 w-3" />
                        {buy.cost}
                      </span>
                    </div>

                    <div>
                      <div className="mt-1 flex max-w-64 gap-2 lg:max-w-none">
                        {buy.armor}

                        {["C", "Q", "E"].map((bind, i) => {
                          return (
                            ability(bind).max_charge -
                              ability(bind).charges_on_spawn !==
                              0 && (
                              <>
                                <span>+</span>

                                <div className="flex flex-col justify-center gap-1">
                                  <Avatar
                                    alt="icons"
                                    className={`bg-transparent h-6 w-6 rounded-none`}
                                    src={ability(bind)?.icon_url}
                                  />

                                  <span className="text-center text-tiny text-default-500">
                                    {"x" +
                                      (ability(bind)?.max_charge -
                                        ability(bind)?.charges_on_spawn)}
                                  </span>
                                </div>
                              </>
                            )
                          );
                        })}

                        {buy.weaponsId.map((id, i) => {
                          return (
                            <>
                              <span>+</span>

                              <div key={i} className="flex flex-col gap-1">
                                <Image
                                  alt="icons"
                                  className={`bg-transparent aspect-auto h-6 rounded-none object-contain`}
                                  src={
                                    weaponsData.find(
                                      (weapon) => weapon.id === id,
                                    )?.icon_url
                                  }
                                />

                                <span className="text-center text-tiny text-default-500">
                                  {
                                    weaponsData.find(
                                      (weapon) => weapon.id === id,
                                    )?.name
                                  }
                                </span>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
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
