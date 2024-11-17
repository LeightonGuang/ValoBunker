"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
  listbox,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import { getSupabase } from "@/utils/supabase/client";
import { PatchesTableType } from "@/types/PatchesTableType";
import { Span } from "next/dist/trace";
export default function Home() {
  const [patchNotesList, setPatchNotesList] = useState<PatchesTableType[]>([]);
  const getAllPatchNotes = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("patches")
        .select(`*`)
        .order("release_date", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPatchNotesList(data);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPatchNotes();
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="w-full lg:order-2 lg:w-64">
          <CardHeader>Upcoming Events</CardHeader>
          <Divider />
          <CardBody>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti,
            porro!
          </CardBody>
        </Card>
        <Card className="w-full lg:order-1">
          <CardHeader>News</CardHeader>
          <Divider />
          <CardBody>
            <Listbox
              aria-label="News"
              classNames={{ list: "gap-2" }}
              items={patchNotesList}
            >
              {patchNotesList.map((patchObj, i) => (
                <ListboxItem
                  key={patchObj.id}
                  showDivider={i !== patchNotesList.length - 1}
                  classNames={{
                    title: "text-[1rem] lg:text-[1.2rem]",
                    base: "flex-col lg:flex-row",
                  }}
                  description={patchObj.description}
                  endContent={
                    <div className="mt-2 flex w-full justify-between lg:h-full lg:w-min lg:flex-col lg:justify-start lg:gap-4">
                      <span className="order-2 whitespace-nowrap text-tiny text-foreground-500 lg:order-1">
                        {patchObj.release_date}
                      </span>
                      <Link
                        isExternal
                        showAnchorIcon
                        className="order-1 whitespace-nowrap text-tiny lg:order-2"
                        href={patchObj.patch_note_link}
                      >
                        Patch Notes
                      </Link>
                    </div>
                  }
                  startContent={
                    <Image
                      className="h-full w-full lg:w-[12.5rem]"
                      src={patchObj.banner_url}
                    />
                  }
                  title={`${patchObj.patch_num} ${patchObj.title}`}
                />
              ))}
            </Listbox>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
