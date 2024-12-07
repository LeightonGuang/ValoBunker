"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@nextui-org/input";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

import { getSupabase } from "@/utils/supabase/client";
import { NewsTableType } from "@/types/NewsTableType";
const CreateNewsPage = () => {
  const router = useRouter();
  const [newsForm, setNewsForm] = useState<NewsTableType>({
    img_url: "",
    title: "",
    content: "",
    news_date: "",
  } as NewsTableType);

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

  return (
    <section>
      <div>
        <Card className="w-96">
          <CardHeader>Create News</CardHeader>
          <CardBody>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-4">
                <Image alt={newsForm.title} src={newsForm.img_url} />
                <Input
                  label="Image URL"
                  name="img_url"
                  placeholder="Image URL"
                  type="url"
                  value={newsForm.img_url}
                  onChange={onNewsFormChange}
                />
              </div>

              <Input
                isRequired
                label="Title"
                name="title"
                placeholder="Title"
                type="text"
                value={newsForm.title}
                onChange={onNewsFormChange}
              />

              <Textarea
                isRequired
                label="Content"
                name="content"
                placeholder="Content"
                type="textarea"
                value={newsForm.content}
                onChange={onNewsFormChange}
              />

              <Input
                isRequired
                label="News Date"
                name="news_date"
                type="date"
                value={newsForm.news_date}
                onChange={onNewsFormChange}
              />

              <Button color="primary" type="submit">
                Create
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default CreateNewsPage;
