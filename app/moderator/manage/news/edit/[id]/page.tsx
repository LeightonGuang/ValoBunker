"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Image,
  Input,
  Button,
  CardBody,
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
          description: newsFormData?.description,
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
        <Card className="w-full">
          <CardBody>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="aspect-w-16 aspect-h-9 flex items-center justify-center lg:w-1/2">
                    <Image
                      alt={newsFormData.headline}
                      className="object-cover"
                      classNames={{
                        wrapper: "w-full h-full",
                      }}
                      src={
                        newsFormData.img_url === ""
                          ? "https://via.placeholder.com/1920x1080"
                          : newsFormData.img_url
                      }
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 lg:w-1/2">
                    <Input
                      label="Image URL"
                      name="img_url"
                      placeholder="Image URL"
                      type="url"
                      value={newsFormData.img_url}
                      onChange={onNewsFormChange}
                    />

                    <Input
                      isRequired
                      errorMessage="Please enter a headline"
                      // isInvalid={newsFormErrors.headline}
                      label="Headline"
                      name="headline"
                      placeholder="Headline"
                      type="text"
                      value={newsFormData.headline}
                      onChange={onNewsFormChange}
                    />

                    <Input
                      label="Description"
                      name="description"
                      placeholder="Description"
                      type="text"
                      value={newsFormData.description || ""}
                      onChange={onNewsFormChange}
                    />

                    <Input
                      isRequired
                      errorMessage="Please enter the news date"
                      // isInvalid={newsFormErrors.news_date}
                      label="News Date"
                      name="news_date"
                      type="date"
                      value={newsFormData.news_date}
                      onChange={onNewsFormChange}
                    />
                  </div>
                </div>

                <NewsTextEditor
                  value={newsFormData.content}
                  onContentChange={(content) =>
                    setNewsFormData({ ...newsFormData, content })
                  }
                />
              </div>

              <Button className="mt-4" color="primary" type="submit">
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
