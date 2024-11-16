"use client";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

export default function Home() {
  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="w-full lg:order-2 lg:w-64">
          <CardHeader>Upcoming Events</CardHeader>
          <Divider />
          <CardBody>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti,
            porro!
          </CardBody>
        </Card>
        <Card className="lg:order-1">
          <CardHeader>News</CardHeader>
          <Divider />
          <CardBody>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit
            nobis incidunt aperiam quibusdam sapiente similique consequatur ut
            iusto. Quibusdam, earum?
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
