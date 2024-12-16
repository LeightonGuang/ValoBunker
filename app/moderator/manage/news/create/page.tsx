"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import {
  Card,
  Image,
  Button,
  CardBody,
  CardHeader,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";
import NewsTextEditor from "@/components/NewsTextEditor";

const CreateNewsPage = () => {
  const router = useRouter();

  const [newsForm, setNewsForm] = useState<NewsTableType>({
    img_url: "",
    headline: "",
    content: "",
    news_date: "",
  } as NewsTableType);

  const [newsFormErrors, setNewsFormErrors] = useState({
    headline: false,
    content: false,
    news_date: false,
  });

  const onNewsFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = getSupabase();

      const { error } = await supabase.from("news").insert([newsForm]);

      if (error) {
        console.error(error);
        alert("Failed to create news. Please try again.");

        return;
      } else {
        router.push("/moderator/manage/news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(newsForm.content);
  }, [newsForm.content]);

  return (
    <section className="w-full">
      <Breadcrumbs aria-label="Breadcrumb" className="mb-4">
        <BreadcrumbItem href="/moderator/manage">Manage</BreadcrumbItem>
        <BreadcrumbItem href="/moderator/manage/news">News</BreadcrumbItem>
        <BreadcrumbItem>Create</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="w-full">
        <CardHeader className={title()}>Create News</CardHeader>
        <CardBody>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="aspect-w-16 aspect-h-9 flex items-center justify-center lg:w-1/2">
                  <Image
                    alt={newsForm.headline}
                    className="object-cover"
                    classNames={{
                      wrapper: "w-full h-full",
                    }}
                    src={
                      newsForm.img_url === ""
                        ? "https://via.placeholder.com/1920x1080"
                        : newsForm.img_url
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
                    value={newsForm.img_url}
                    onChange={onNewsFormChange}
                  />

                  <Input
                    isRequired
                    errorMessage="Please enter a headline"
                    isInvalid={newsFormErrors.headline}
                    label="Headline"
                    name="headline"
                    placeholder="Headline"
                    type="text"
                    value={newsForm.headline}
                    onChange={onNewsFormChange}
                  />

                  <Input
                    label="Description"
                    name="description"
                    placeholder="Description"
                    type="text"
                    value={newsForm.description || ""}
                    onChange={onNewsFormChange}
                  />

                  <Input
                    isRequired
                    errorMessage="Please enter the news date"
                    isInvalid={newsFormErrors.news_date}
                    label="News Date"
                    name="news_date"
                    type="date"
                    value={newsForm.news_date}
                    onChange={onNewsFormChange}
                  />
                </div>
              </div>

              <NewsTextEditor
                value={newsForm.content}
                onContentChange={(content) =>
                  setNewsForm({ ...newsForm, content })
                }
              />
            </div>

            <Button className="mt-4" color="primary" type="submit">
              Create
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
};

export default CreateNewsPage;
