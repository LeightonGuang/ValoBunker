"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
const EditPatchPage = () => {
  const router = useRouter();
  const patchId = useParams().id;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [patchForm, setPatchForm] = useState<PatchesTableType>(
    {} as PatchesTableType,
  );

  const fetchpatchById = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("patches")
        .select("*")
        .eq("id", patchId);

      if (error) {
        console.error(error);
      } else {
        setPatchForm(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPatchNoteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!patchForm) return;

    setPatchForm({ ...patchForm, [e.target.name]: e.target.value });
  };

  const handlePatchNoteUpdateSubmit = async () => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("patches")
        .update(patchForm)
        .eq("id", patchId)
        .select();

      if (error) {
        console.error(error);
      } else {
        // console.log(data);
        router.push("/moderator/manage/patches");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchpatchById();
  }, []);

  return (
    <section>
      <Breadcrumbs aria-label="Breadcrumb">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/patches">
          Patches
        </BreadcrumbItem>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className={title()}>Edit Patch Note</h1>
      <div className="mt-6 flex justify-center">
        {!isLoading && (
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
                  value={patchForm.banner_url}
                  onChange={onPatchNoteFormChange}
                />

                <Input
                  label="Release Date"
                  name="release_date"
                  placeholder="dd/mm/yyyy"
                  type="date"
                  value={patchForm.release_date}
                  onChange={onPatchNoteFormChange}
                />

                <div className="flex gap-4">
                  <Input
                    label="Episode"
                    name="episode"
                    placeholder="episode"
                    type="number"
                    value={`${patchForm.episode}`}
                    onChange={onPatchNoteFormChange}
                  />

                  <Input
                    label="Act"
                    name="act"
                    placeholder="act"
                    type="number"
                    value={`${patchForm.act}`}
                    onChange={onPatchNoteFormChange}
                  />
                </div>

                <Input
                  label="Patch Number"
                  name="patch_num"
                  placeholder="eg. 9.00, 9.01, 9.02"
                  // type text because number will replace .10 with .1
                  type="text"
                  value={patchForm.patch_num}
                  onChange={onPatchNoteFormChange}
                />

                <Input
                  label="Title"
                  name="title"
                  placeholder="title"
                  type="text"
                  value={patchForm.title}
                  onChange={onPatchNoteFormChange}
                />

                <Textarea
                  label="Description"
                  name="description"
                  placeholder="First few paragraphs of the patch note"
                  type="text"
                  value={patchForm.description}
                  onChange={onPatchNoteFormChange}
                />

                <Input
                  label="Patch Note Link"
                  name="patch_note_link"
                  placeholder="link"
                  type="url"
                  value={patchForm.patch_note_link}
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
                    formAction={handlePatchNoteUpdateSubmit}
                    type="submit"
                  >
                    Update
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

export default EditPatchPage;
