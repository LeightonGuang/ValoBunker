"use client";

import {
  User,
  Card,
  Image,
  Input,
  Avatar,
  Button,
  Select,
  Divider,
  CardBody,
  Textarea,
  SelectItem,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { RolesTableType } from "@/types/RolesTableType";
import { AgentsTableType } from "@/types/AgentsTableType";
import { AbilitiesTableType } from "@/types/AbilitiesTableType";

const EditAgentsPage = () => {
  const router = useRouter();
  const agentId = useParams().id;
  const [isLoading, setIsLoading] = useState(true);
  const [agentRoles, setAgentRoles] = useState<RolesTableType[]>([]);
  const [agentForm, setAgentForm] = useState<AgentsTableType | null>(null);
  const [abilitiesForm, setAbilitiesForm] = useState<AbilitiesTableType[]>([]);

  const abilitiesKeyBinds = [
    { bind: "E" },
    { bind: "Q" },
    { bind: "C" },
    { bind: "X" },
  ];

  const onAgentFormChange = (e: any) => {
    e.preventDefault();

    if (!agentForm) return;

    setAgentForm({ ...agentForm, [e.target.name]: e.target.value });
  };

  const onAbilitiesFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyBind: string,
  ) => {
    e.preventDefault();

    if (!abilitiesForm) return;

    setAbilitiesForm(
      abilitiesForm.map((ability) =>
        ability.key_bind === keyBind
          ? {
              ...ability,
              [e.target.name]:
                e.target.name === "cost"
                  ? Number(e.target.value)
                  : e.target.value,
            }
          : ability,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update agent details
    try {
      const supabase = getSupabase();

      const { error: agentError } = await supabase
        .from("agents")
        .update({
          name: agentForm?.name,
          icon_url: agentForm?.icon_url,
          role_id: agentForm?.role_id,
          release_date: agentForm?.release_date,
        })
        .eq("id", agentId);

      if (agentError) throw agentError;
      // Update abilities details
      const { error: abilitiesError } = await supabase
        .from("abilities")
        .upsert(abilitiesForm);

      if (abilitiesError) throw abilitiesError;

      router.push("/moderator/manage/agents");
    } catch (error) {
      console.error(error);
      alert("Failed to update agent.");
    }
  };

  useEffect(() => {
    const fetchRolesAndAgent = async () => {
      try {
        const supabase = getSupabase();
        const { data: rolesData, error: rolesError } = await supabase
          .from("roles")
          .select("*");

        if (rolesError) {
          console.error(rolesError);
        } else {
          setAgentRoles(rolesData);
        }

        const { data: agentsData, error: agentsError } = await supabase
          .from("agents")
          .select(`*, abilities(*),roles(*)`)
          .eq("id", agentId);

        if (agentsError) {
          console.error(agentsError);
        } else {
          setAgentForm(agentsData[0]);

          if (agentsData[0].abilities.length === 0) {
            setAbilitiesForm([
              {
                id: 0,
                key_bind: "E",
                name: "",
                icon_url: "",
                description: "",
                cost: 0,
              } as AbilitiesTableType,
              {
                id: 1,
                key_bind: "Q",
                name: "",
                icon_url: "",
                description: "",
                cost: 0,
              } as AbilitiesTableType,
              {
                id: 2,
                key_bind: "C",
                name: "",
                icon_url: "",
                description: "",
                cost: 0,
              } as AbilitiesTableType,
              {
                id: 3,
                key_bind: "X",
                name: "",
                icon_url: "",
                description: "",
                cost: 0,
              } as AbilitiesTableType,
            ]);
          } else {
            setAbilitiesForm(agentsData[0].abilities);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolesAndAgent();
  }, []);

  useEffect(() => {
    console.log(agentForm);
  }, [agentForm]);

  useEffect(() => {
    console.table(abilitiesForm);
  }, [abilitiesForm]);

  return (
    <section>
      <Breadcrumbs aria-label="breadcrumb" className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/agents">Agents</BreadcrumbItem>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className={title()}>Edit Agents</h1>

      <div className="mt-6 flex justify-center">
        {!isLoading && (
          <Card className="w-96">
            <CardBody>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <label htmlFor="agentInfo">Agent Info</label>

                  <div className="flex items-center gap-4">
                    <Avatar
                      className="h-10 min-h-10 w-10 min-w-10"
                      src={agentForm?.icon_url}
                    />
                    <Input
                      label="Agent Icon URL"
                      name="icon_url"
                      placeholder="Agent Icon URL"
                      type="URL"
                      value={agentForm?.icon_url}
                      onChange={onAgentFormChange}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Input
                      isRequired
                      label="Agent Name"
                      name="name"
                      placeholder="Agent Name"
                      type="text"
                      value={agentForm?.name}
                      onChange={onAgentFormChange}
                    />

                    <Input
                      isRequired
                      label="Release Date"
                      name="release_date"
                      type="date"
                      value={agentForm?.release_date}
                      onChange={onAgentFormChange}
                    />
                  </div>
                </div>

                <Divider />

                <div className="flex flex-col gap-4">
                  {abilitiesKeyBinds.map((keybind, i) => {
                    const currentKeybind = abilitiesKeyBinds[i].bind;
                    const currentAbility = abilitiesForm.find(
                      (form) => form.key_bind === keybind.bind,
                    );

                    return (
                      <div
                        key={currentAbility?.id}
                        className="flex flex-col gap-4"
                      >
                        <h2>{currentKeybind} Ability</h2>
                        <div className="flex items-center gap-2">
                          <Image
                            alt={currentAbility?.name}
                            className="h-8 max-h-8 w-8 max-w-8 rounded-none"
                            src={
                              currentAbility?.icon_url === ""
                                ? "https://placehold.co/32x32"
                                : currentAbility?.icon_url
                            }
                          />

                          <Input
                            isRequired
                            label="Ability Icon URL"
                            name="icon_url"
                            type="url"
                            value={currentAbility?.icon_url}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />
                        </div>

                        <div className="flex gap-4">
                          <Input
                            isRequired
                            label={`${currentKeybind} Ability Name`}
                            name="name"
                            type="text"
                            value={currentAbility?.name}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />

                          <Input
                            label="Cost"
                            name="cost"
                            type="number"
                            value={`${currentAbility?.cost}`}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            isRequired
                            label="Charges on Spawn"
                            name="charges_on_spawn"
                            type="number"
                            value={`${currentAbility?.charges_on_spawn}`}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />
                          <Input
                            isRequired
                            label="Max Charge"
                            name="max_charge"
                            type="number"
                            value={`${currentAbility?.max_charge}`}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />
                          <Input
                            label="Ult Orb Number"
                            name="ult_points"
                            type="number"
                            value={`${currentAbility?.ult_points}`}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />
                          <Input
                            label="Cooldown"
                            name="cooldown"
                            type="number"
                            value={`${currentAbility?.cooldown}`}
                            onChange={(e) => {
                              onAbilitiesFormChange(e, currentKeybind);
                            }}
                          />
                        </div>

                        <Textarea
                          label="Description"
                          name="description"
                          type="textarea"
                          value={currentAbility?.description}
                          onChange={(e) =>
                            onAbilitiesFormChange(e, currentKeybind)
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex w-full justify-between gap-4">
                  <Button
                    className="w-full"
                    color="danger"
                    onClick={() => router.push("/moderator/manage/agents")}
                  >
                    Cancel
                  </Button>
                  <Button className="w-full" color="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  );
};

export default EditAgentsPage;
