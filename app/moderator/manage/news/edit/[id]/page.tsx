"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Image,
  Input,
  Button,
  CardBody,
  Textarea,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";
import NewsTextEditor from "@/components/NewsTextEditor";

const EditNewsPage = () => {
  const router = useRouter();
  const newsId = useParams().id;
  const [newsFormData, setNewsFormData] = useState<NewsTableType>({
    img_url: "",
    headline: "",
    content: "",
    news_date: "",
  } as NewsTableType);

  const fetchNewsById = async () => {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("news")
        .select(`*`)
        .eq("id", newsId);

      if (error) {
        console.error(error);
      } else {
        setNewsFormData(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onNewsFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!newsFormData) return;

    setNewsFormData({ ...newsFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = getSupabase();

      const { error } = await supabase
        .from("news")
        .update({
          img_url: newsFormData?.img_url,
          headline: newsFormData?.headline,
          content: newsFormData?.content,
          news_date: newsFormData?.news_date,
        })
        .eq("id", newsId);

      if (error) {
        console.error(error);
        alert("Failed to update news");

        return;
      } else {
        router.push("/moderator/manage/news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNewsById();
  }, []);

  useEffect(() => {
    console.log(newsFormData.content);
  }, [newsFormData.content]);

  return (
    <section className="w-full">
      <Breadcrumbs aria-label="Breadcrumb" className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/news">News</BreadcrumbItem>
        <BreadcrumbItem>Edit</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-center">
        <Card className="w-96">
          <CardBody>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <Image className="mx-auto w-1/2" src={newsFormData?.img_url} />

                <Input
                  label="Image URL"
                  name="img_url"
                  type="url"
                  value={newsFormData?.img_url}
                  onChange={onNewsFormChange}
                />
              </div>

              <Input
                label="Headline"
                name="headline"
                type="text"
                value={newsFormData?.headline}
                onChange={onNewsFormChange}
              />

              <NewsTextEditor
                value={newsFormData.content}
                onContentChange={(value) =>
                  setNewsFormData({ ...newsFormData, content: value })
                }
              />

              <Input
                label="Date"
                name="news_date"
                type="date"
                value={newsFormData?.news_date}
                onChange={onNewsFormChange}
              />

              <Button color="primary" type="submit">
                Update
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default EditNewsPage;
