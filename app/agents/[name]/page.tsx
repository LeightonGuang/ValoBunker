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
        setAgentData(agentData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const AgentCard = ({ className }: { className?: string }) => {
    const ability = (bind: string) =>
      agentData?.abilities.find((ability) => ability.key_bind === bind);

    return (
      <Card className={className}>
        <CardHeader className="flex justify-between">
          <div className="flex items-center gap-4">
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
        </CardHeader>

        <Divider />

        <CardBody>
          <div className="flex items-center justify-center gap-2">
            {abilitiesOrder.map((bind, i) => {
              return (
                <div key={bind} className="flex items-center gap-2">
                  <Tooltip key={bind} content={ability(bind)?.name}>
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

                  {i < abilitiesOrder.length - 1 && <Divider className="w-2" />}
                </div>
              );
            })}
          </div>

          <Divider className="my-3" />

          <div className="flex flex-col gap-4">
            {abilitiesOrder.map((bind) => {
              return (
                <div key={bind}>
                  <div className="flex items-center gap-2">
                    <span className="text-medium">{ability(bind)?.name}</span>
                    <span className="text-tiny text-default-400">
                      {ability(bind)?.cost
                        ? ability(bind)?.cost
                        : ability(bind)?.cost === 0
                          ? "Free"
                          : ability(bind)?.cost === null
                            ? `${ability(bind)?.ult_points ?? "x"} ult points`
                            : ""}
                    </span>
                  </div>

                  <p className="mt-2 text-tiny">{ability(bind)?.description}</p>
                </div>
              );
            })}
          </div>
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
            <AgentCard className="mt-4 w-96" />
          </div>
        </div>
      )}
    </section>
  );
};

export default AgentPage;
