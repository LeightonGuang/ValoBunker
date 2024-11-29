"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { EllipsisIcon } from "@/components/icons";
import { getSupabase } from "@/utils/supabase/client";
import { PatchesTableType } from "@/types/PatchesTableType";

const columnsHeader: string[] = ["Release Date", "Version", "Title", "Actions"];

const ManagePatchesPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [patchesData, setPatchesData] = useState<PatchesTableType[]>([]);
  const [patchToDelete, setPatchToDelete] = useState<PatchesTableType>(
    {} as PatchesTableType,
  );

  const fetchPatches = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("patches")
        .select("*")
        .order("release_date", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        // console.log(data);
        setPatchesData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatchById = async (id: number) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("patches")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
      } else {
        // console.log(data);
        fetchPatches();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const topContent = () => (
    <div className="flex items-center justify-between">
      <span>Total {patchesData.length} Patches</span>
      <Button
        color="primary"
        endContent={<span>+</span>}
        onClick={() => router.push("/moderator/manage/patches/add")}
      >
        Add Patch Note
      </Button>
    </div>
  );
  useEffect(() => {
    fetchPatches();
  }, []);

  return (
    <section>
      <Breadcrumbs aria-label="Patches" className="mb-6">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>Patches</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className={title()}>Manage Patches</h1>
      <div className="mt-6">
        <Table
          aria-label="Patches"
          selectionMode="single"
          topContent={topContent()}
          topContentPlacement="outside"
        >
          <TableHeader>
            {columnsHeader.map((column, i) => (
              <TableColumn key={i}>{column}</TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {patchesData.map((patch) => (
              <TableRow key={patch.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(patch.release_date).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>{patch.patch_num}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      className="max-h-8 rounded-none"
                      src={patch.banner_url}
                    />
                    <p className="overflow-hidden whitespace-nowrap">
                      {patch.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly variant="light">
                        <EllipsisIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          router.push(
                            `/moderator/manage/patches/edit/${patch.id}`,
                          )
                        }
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          onOpen();
                          setPatchToDelete(patch);
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isOpen}
        size="md"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>{`Are you sure you want to delete patch ${patchToDelete.patch_num}?`}</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  color="danger"
                  onClick={() => {
                    deletePatchById(patchToDelete.id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>{" "}
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default ManagePatchesPage;
