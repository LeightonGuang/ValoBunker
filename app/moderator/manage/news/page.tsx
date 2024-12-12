"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@nextui-org/table";
import Link from "next/link";
import {
  Image,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  useDisclosure,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Breadcrumbs,
  BreadcrumbItem,
  Code,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { NewsTableType } from "@/types/NewsTableType";
import { getSupabase } from "@/utils/supabase/client";
import { EllipsisIcon } from "@/components/icons";

const columnsHeader: { name: string; sortable: boolean }[] = [
  { name: "Title", sortable: true },
  { name: "Image", sortable: false },
  { name: "Content", sortable: true },
  { name: "News Date", sortable: true },
  { name: "Action", sortable: false },
];

const ManageNewsPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [newsToDelete, setNewsToDelete] = useState<NewsTableType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState<NewsTableType[]>([]);

  const fetchAllNews = async () => {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("news_date", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setNewsData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNewsById = async (id: number) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("news").delete().eq("id", id);

      if (error) {
        console.error(error);
      } else {
        // console.log(data);
        fetchAllNews();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const topContent = () => (
    <div className="flex items-center justify-between">
      <span className="text-small text-default-400">
        Total {newsData.length} News
      </span>
      <Button
        color="primary"
        endContent={<span>+</span>}
        onClick={() => router.push("/moderator/manage/news/create")}
      >
        News Article
      </Button>
    </div>
  );

  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <section>
      <Breadcrumbs aria-label="News">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem>News</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className={title()}>Manage News</h1>

      <div>
        <Table
          aria-label="News"
          topContent={topContent()}
          topContentPlacement="outside"
        >
          <TableHeader>
            {columnsHeader.map((column, i) => (
              <TableColumn key={i}>{column.name}</TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {newsData.map((news) => (
              <TableRow key={news.id}>
                <TableCell>{news.title}</TableCell>

                <TableCell>
                  <Image
                    alt={news.title}
                    className="h-16 min-h-16 w-16 min-w-16 rounded-none object-contain"
                    src={news.img_url}
                  />
                </TableCell>

                <TableCell>
                  <div className="line-clamp-2 overflow-hidden text-ellipsis">
                    {news.content}
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {news.news_date}
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
                          router.push(`/moderator/manage/news/edit/${news.id}`)
                        }
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          onOpen();
                          setNewsToDelete(news);
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
              <ModalBody className="text-medium">
                {`Are you sure you want to delete News: `}
                <Image
                  className="h-16 min-h-16 w-16 min-w-16"
                  src={newsToDelete?.img_url}
                />
                <span>
                  <Code className="whitespace-break-spaces" color="default">
                    {newsToDelete?.title}
                  </Code>
                  ?
                </span>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  color="danger"
                  onClick={() => {
                    newsToDelete && deleteNewsById(newsToDelete?.id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default ManageNewsPage;
