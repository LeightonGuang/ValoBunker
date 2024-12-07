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
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { title } from "@/components/primitives";
import { NewsTableType } from "@/types/NewsTableType";
import { getSupabase } from "@/utils/supabase/client";

const columnsHeader: { name: string; sortable: boolean }[] = [
  { name: "Title", sortable: true },
  { name: "Image", sortable: false },
  { name: "Content", sortable: true },
  { name: "News Date", sortable: true },
  { name: "Action", sortable: false },
];

const ManageNewsPage = () => {
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
        console.log(data);
        setNewsData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <section>
      <h1 className={title()}>Manage News</h1>

      <div>
        <Link href="/moderator/manage/news/create">Create News</Link>
        <Table aria-label="News">
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
                <TableCell>Ac</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ManageNewsPage;
