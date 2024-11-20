"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
} from "@nextui-org/react";

import { DiscordIcon, GoogleIcon } from "@/components/icons";

const LoginPage = () => {
  return (
    <section className="mx-auto h-full w-full lg:mx-0 lg:flex lg:items-center">
      <div className="mt-4 flex h-full w-full justify-center">
        <div className="flex items-center justify-center lg:w-1/2 lg:bg-darkBlue">
          <Card className="h-min w-80">
            <CardHeader>
              <div className="mx-auto flex w-min flex-col whitespace-nowrap text-center">
                <span className="text-2xl">Welcome Back</span>
                <span className="text-sm">Log in to your account</span>
              </div>
            </CardHeader>
            <CardBody className="gap-4">
              <Input
                isRequired
                label="Email"
                placeholder="you@example.com"
                type="email"
              />
              <Input
                isRequired
                label="Password"
                placeholder="password"
                type="password"
              />
              <Button color="primary">Log in</Button>
              <Divider />
              <div className="flex w-full flex-col gap-4">
                <Button
                  className="w-full bg-white font-medium text-black light:border-1 light:border-default-500"
                  startContent={<GoogleIcon className="h-4 w-4" />}
                >
                  Log in with Google
                </Button>
                <Button
                  className="w-full bg-blurple font-medium text-white"
                  startContent={<DiscordIcon className="h-4 w-4" />}
                >
                  Log in with Discord
                </Button>
                <div className="text-center text-sm">
                  {`Don't have an account? `}
                  <Link className="text-sm" href="/signup">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="hidden h-full w-1/2 object-fill lg:flex">
          <Image
            className="h-full rounded-none lg:object-cover"
            src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/60cfa90e4a5195c27e50c00fb8aeb017c6855c8e-1920x1080.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
