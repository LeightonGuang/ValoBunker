"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

import { title } from "@/components/primitives";
import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";
import NewsTextEditor from "@/components/NewsTextEditor";

const CreateNewsPage = () => {
  const router = useRouter();

  const [newsForm, setNewsForm] = useState<NewsTableType>({
    img_url: "",
    title: "",
    content: "",
    news_date: "",
  } as NewsTableType);

  const [newsFormErrors, setNewsFormErrors] = useState({
    title: false,
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
    <section className="flex w-full items-center justify-center">
      <Card className="w-full">
        <CardHeader className={title()}>Create News</CardHeader>
        <CardBody>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="aspect-w-16 aspect-h-9 flex items-center justify-center lg:w-1/2">
                  <Image
                    alt={newsForm.title}
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
                    errorMessage="Please enter a title"
                    isInvalid={newsFormErrors.title}
                    label="Title"
                    name="title"
                    placeholder="Title"
                    type="text"
                    value={newsForm.title}
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
                content={newsForm.content}
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
