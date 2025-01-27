"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Card, CardHeader, Divider, Image } from "@heroui/react";

import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";
const AllNewsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [newsData, setNewsData] = useState<NewsTableType[]>([]);
  const fetchAllNews = async () => {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("news_date", { ascending: false });

      if (data) {
        setNewsData(data);
      }

      if (error) {
        console.error(error);
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
      <Card>
        <CardHeader className="text-large">News</CardHeader>
        <Divider />
        <Listbox
          aria-label="News"
          onAction={(key) => {
            router.push(`/news/${key}`);
          }}
        >
          {newsData.map((news) => (
            <ListboxItem
              key={news.id}
              description={<p>{news.description}</p>}
              endContent={
                <span className="h-max whitespace-nowrap text-tiny text-foreground-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(news.news_date))}
                </span>
              }
              startContent={
                <Image
                  alt={news.headline}
                  className="h-12 min-h-12 w-12 min-w-12 rounded-none"
                  src={news.img_url}
                />
              }
              title={news.headline}
            />
          ))}
        </Listbox>
      </Card>
    </section>
  );
};

export default AllNewsPage;
