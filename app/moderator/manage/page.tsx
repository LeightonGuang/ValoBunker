"use client";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";

const buttonList = [
  { name: "Agents", href: "/moderator/manage/agents" },
  { name: "Events", href: "/moderator/manage/events" },
  { name: "Teams", href: "/moderator/manage/teams" },
];
const ManagePage = () => {
  const router = useRouter();

  return (
    <section>
      <h1 className={title()}>Manage</h1>
      <div className="mt-6 flex justify-center">
        <div className="grid grid-cols-2 gap-4">
          {buttonList.map((button) => (
            <Button
              className="h-64 w-64"
              key={button.name}
              color="default"
              onClick={() => {
                router.push(button.href);
              }}
            >
              {button.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagePage;
