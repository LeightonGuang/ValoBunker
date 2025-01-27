"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Textarea,
} from "@heroui/react";

import { getSupabase } from "@/utils/supabase/client";
import { PatchesTableType } from "@/types/PatchesTableType";
import { title } from "@/components/primitives";

const AddPatchPage = () => {
  const router = useRouter();
  const [patchForm, setPatchForm] = useState<PatchesTableType>(
    {} as PatchesTableType,
  );

  const handleAddPatchNoteSubmit = async () => {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase.from("patches").insert(patchForm);

      if (error) {
        console.error(error);
      } else {
        router.push("/moderator/manage/patches");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onPatchNoteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setPatchForm({ ...patchForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.table(patchForm);
  }, [patchForm]);

  return (
    <section>
      <Breadcrumbs aria-label="breadcrumb" className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/events">Events</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className={title()}>Add Patch Notes</h1>
      <div className="mt-6 flex justify-center">
        <Card className="w-96">
          <CardBody>
            <form className="flex flex-col gap-4">
              <div className="flex justify-center">
                <Image
                  className="max-h-40"
                  src={
                    !patchForm.banner_url
                      ? "https://placehold.co/1920x1080"
                      : patchForm.banner_url
                  }
                />
              </div>

              <Input
                label="Banner URL"
                name="banner_url"
                placeholder="Banner URL"
                type="url"
                onChange={onPatchNoteFormChange}
              />

              <Input
                label="Release Date"
                name="release_date"
                placeholder="dd/mm/yyyy"
                type="date"
                onChange={onPatchNoteFormChange}
              />

              <div className="flex gap-4">
                <Input
                  label="Episode"
                  name="episode"
                  placeholder="episode"
                  type="number"
                  onChange={onPatchNoteFormChange}
                />

                <Input
                  label="Act"
                  name="act"
                  placeholder="act"
                  type="number"
                  onChange={onPatchNoteFormChange}
                />
              </div>

              <Input
                label="Patch Number"
                name="patch_num"
                placeholder="eg. 9.00, 9.01, 9.02"
                // type text because number will replace .10 with .1
                type="text"
                onChange={onPatchNoteFormChange}
              />

              <Input
                label="Title"
                name="title"
                placeholder="title"
                type="text"
                onChange={onPatchNoteFormChange}
              />

              <Textarea
                label="Description"
                name="description"
                placeholder="First few paragraphs of the patch note"
                type="text"
                onChange={onPatchNoteFormChange}
              />

              <Input
                label="Patch Note Link"
                name="patch_note_link"
                placeholder="link"
                type="url"
                onChange={onPatchNoteFormChange}
              />

              <div className="flex w-full justify-between gap-4">
                <Button
                  className="w-full"
                  color="danger"
                  onClick={() => router.push("/moderator/manage/patches")}
                >
                  Cancel
                </Button>

                <Button
                  className="w-full"
                  color="primary"
                  formAction={handleAddPatchNoteSubmit}
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default AddPatchPage;
