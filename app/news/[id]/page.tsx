"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";

import { NewsTableType } from "@/types/NewsTableType";
import { getSupabase } from "@/utils/supabase/client";
import { title } from "@/components/primitives";

const NewsPage = () => {
  const newsId = useParams().id;
  const [newsData, setNewsData] = useState<NewsTableType>();
  const fetchNewsById = async () => {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", newsId);

      if (error) {
        console.error(error);
      }

      if (data) {
        setNewsData(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNewsById();
  }, []);

  return (
    <section>
      <Card aria-label={newsData?.title}>
        <CardHeader className={title()}>{newsData?.title}</CardHeader>
        <CardBody>
          {
            <>
              <Image alt={newsData?.title} src={newsData?.img_url} />
              <p>{newsData?.content}</p>
            </>
          }
        </CardBody>
        <CardFooter className="whitespace-nowrap text-tiny text-foreground-500">
          {newsData?.news_date}
        </CardFooter>
      </Card>
    </section>
  );
};

export default NewsPage;
