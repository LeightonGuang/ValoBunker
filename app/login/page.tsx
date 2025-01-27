"use client";

import {
  Card,
  Form,
  Link,
  Image,
  Divider,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { logIn } from "../actions/auth/login/actions";

import { signUpWithGoogle } from "@/utils/signUpWithGoogle";
import { DiscordIcon, GoogleIcon } from "@/components/icons";
import { signUpWithDiscord } from "@/utils/signUpWithDiscord";

const LoginPage = () => {
  const [logInForm, setLogInForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [logInErrorMessage, setLogInErrorMessage] = useState<string>("");
  const router = useRouter();

  const onLogInFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
  };

  const handleLogIn = async () => {
    try {
      const { data, error } = await logIn(logInForm.email, logInForm.password);

      if (error) {
        setLogInErrorMessage(error);
        console.error(error);
      }

      if (data) {
        router.push("/");
      }
    } catch (error) {
      setLogInErrorMessage("Unexpected error, please try again.");
      console.error(error);
    }
  };

  return (
    <section className="mx-auto h-full w-full lg:mx-0 lg:flex lg:items-center">
      <div className="mt-4 flex h-full w-full justify-center">
        <div className="hidden h-full w-1/2 object-fill lg:flex">
          <Image
            className="h-full rounded-none lg:object-cover"
            src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/60cfa90e4a5195c27e50c00fb8aeb017c6855c8e-1920x1080.jpg"
          />
        </div>

        <div className="flex items-center justify-center lg:w-1/2 lg:bg-darkBlue">
          <Card className="h-min w-80">
            <CardHeader>
              <div className="mx-auto flex w-min flex-col whitespace-nowrap text-center">
                <span className="text-2xl">Welcome Back</span>
                <span className="text-sm">Log in to your account</span>
              </div>
            </CardHeader>

            <CardBody className="gap-4">
              <Form className="flex flex-col gap-4">
                <Input
                  isRequired
                  isInvalid={logInErrorMessage !== ""}
                  label="Email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  onChange={onLogInFormChange}
                />

                <Input
                  isRequired
                  errorMessage={logInErrorMessage}
                  isInvalid={logInErrorMessage !== ""}
                  label="Password"
                  name="password"
                  placeholder="password"
                  type="password"
                  onChange={onLogInFormChange}
                />

                <Button
                  className="w-full"
                  color="primary"
                  formAction={handleLogIn}
                  type="submit"
                >
                  Log in
                </Button>
              </Form>

              <Divider />

              <div className="flex w-full flex-col gap-4">
                <Button
                  className="w-full bg-white font-medium text-black light:border-1 light:border-default-500"
                  startContent={<GoogleIcon className="h-4 w-4" />}
                  onPress={signUpWithGoogle}
                >
                  Log in with Google
                </Button>

                <Button
                  className="w-full bg-blurple font-medium text-white"
                  startContent={<DiscordIcon className="h-4 w-4" />}
                  onPress={signUpWithDiscord}
                >
                  Log in with Discord
                </Button>

                <div className="text-center text-tiny">
                  {`Don't have an account? `}
                  <Link className="text-tiny" href="/signup">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
