"use client";

import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Select,
  SelectItem,
  User,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { AgentsTableType } from "@/types/AgentsTableType";
import { RolesTableType } from "@/types/RolesTableType";
// import { findObjectByKeyBind } from "@/utils/findObjectByKeyBind";
import { AbilitiesTableType } from "@/types/AbilitiesTableType";

const EditAgentsPage = () => {
  const router = useRouter();
  const agentId = useParams().id;
  const [isLoading, setIsLoading] = useState(true);
  const [agentRoles, setAgentRoles] = useState<RolesTableType[]>([]);
  const [agentForm, setAgentForm] = useState<AgentsTableType | null>(null);
  const [abilitiesForm, setAbilitiesForm] = useState<AbilitiesTableType[]>([]);
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
        setAbilitiesForm(agentsData[0].abilities);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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

    const { name, value } = e.target;

    setAbilitiesForm((prevAbilities) =>
      prevAbilities.map((ability) =>
        ability.key_bind === keyBind
          ? { ...ability, [name]: name === "cost" ? Number(value) : value }
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
    fetchRolesAndAgent();
  }, []);

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
                <div className="flex items-center gap-4">
                  <Image
                    alt={agentForm?.name}
                    className="h-12 max-h-12 w-12 max-w-12 rounded-full"
                    src={agentForm?.icon_url}
                  />

                  <Input
                    label="Agent Icon URL"
                    name="icon_url"
                    value={agentForm?.icon_url}
                    onChange={onAgentFormChange}
                  />
                </div>

                <Input
                  label="Agent Name"
                  name="name"
                  value={agentForm?.name}
                  onChange={onAgentFormChange}
                />

                <Select
                  aria-label="Agent Role"
                  items={agentRoles}
                  label="Agent Role"
                  placeholder="Select Agent Role"
                  renderValue={(agentRoles) => {
                    return agentRoles.map((role) => (
                      <div key={role.key}>
                        <Avatar
                          alt={role.data?.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={role.data?.icon_url}
                        />
                        <div className="flex flex-col">
                          <span>{role.data?.name}</span>
                          <span className="text-tiny text-default-500">
                            {role.data?.description}
                          </span>
                        </div>
                      </div>
                    ));
                  }}
                >
                  {agentRoles.map((role) => (
                    <SelectItem
                      key={role.id}
                      textValue={role.name}
                      value={role.id}
                    >
                      <User
                        avatarProps={{ src: role.icon_url }}
                        name={role.name}
                      />
                    </SelectItem>
                  ))}
                </Select>

                {abilitiesForm.map((ability) => (
                  <div key={ability.key_bind} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Image
                        alt={ability.name}
                        className="h-12 max-h-12 w-12 max-w-12 rounded-full"
                        src={ability.icon_url}
                      />
                      <Input
                        isRequired
                        label={`${ability.key_bind} Ability Icon URL`}
                        name="icon_url"
                        value={ability.icon_url}
                        onChange={(e) =>
                          onAbilitiesFormChange(e, ability.key_bind)
                        }
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        isRequired
                        label={`${ability.key_bind} Ability Name`}
                        name="name"
                        value={ability.name}
                        onChange={(e) =>
                          onAbilitiesFormChange(e, ability.key_bind)
                        }
                      />
                      <Input
                        label={`${ability.key_bind} Ability Cost`}
                        name="cost"
                        type="number"
                        value={`${ability.cost}`}
                        onChange={(e) =>
                          onAbilitiesFormChange(e, ability.key_bind)
                        }
                      />
                    </div>
                  </div>
                ))}

                <Button className="w-full" color="primary" type="submit">
                  Update
                </Button>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  );
};

export default EditAgentsPage;
