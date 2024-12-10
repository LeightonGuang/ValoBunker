"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  Link,
  Image,
  Divider,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";

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
        <CardHeader className={title()}>
          <span>{newsData?.title}</span>
        </CardHeader>
        <CardBody>
          <div>
            <div className="flex w-full justify-center">
              <Image
                alt={newsData?.title}
                className="max-h-64"
                src={newsData?.img_url}
              />
            </div>

            <Divider className="my-4" />

            <div className="mt-4 w-full">
              <p className="mx-auto max-w-3xl">{newsData?.content}</p>
            </div>
          </div>
        </CardBody>
        <CardFooter className="awhitespace-nowrap flex justify-between text-tiny text-foreground-500">
          <div>{newsData?.news_date}</div>

          {newsData?.link_url && (
            <Link
              isExternal
              showAnchorIcon
              className="order-1 whitespace-nowrap text-tiny lg:order-2"
              href={newsData?.link_url}
            >
              Link
            </Link>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default NewsPage;
