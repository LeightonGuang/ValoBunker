"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Avatar, Card, CardBody, CardHeader, User } from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { AgentsTableType } from "@/types/AgentsTableType";

const AgentPage = () => {
  const agentId = useParams().id;
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<AgentsTableType>();

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("agents")
        .select(`*, abilities(*), roles(*)`)
        .eq("id", agentId);

      if (error) {
        console.error(error);
      } else {
        setAgentData(data[0]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const AgentCard = ({ className }: { className?: string }) => {
    const abilitiesOrder = ["C", "Q", "E", "X"];

    return (
      <Card className={className}>
        <CardHeader className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar alt={agentData?.name} size="lg" src={agentData?.icon_url} />

            <span className="text-large">{agentData?.name}</span>
          </div>

          <User
            avatarProps={{
              src: agentData?.roles.icon_url,
              className: "h-6 w-6",
            }}
            name={agentData?.roles.name}
          />
        </CardHeader>

        <CardBody>
          <div>
            <ul className="flex flex-col gap-2">
              {abilitiesOrder.map((keybind) => {
                const ability = agentData?.abilities.filter(
                  (ability) => ability.key_bind === keybind,
                )[0];

                return (
                  <div
                    key={ability?.id}
                    className="flex flex-col justify-start gap-2"
                  >
                    <User
                      avatarProps={{
                        src: ability?.icon_url,
                        size: "md",
                        className: "bg-transparent",
                      }}
                      className="w-max"
                      name={ability?.name}
                    />

                    <div>cost: {ability?.cost ? ability?.cost : "-"}</div>
                  </div>
                );
              })}
            </ul>
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
      {!isLoading && <AgentCard className="w-96" />}
    </section>
  );
};

export default AgentPage;
