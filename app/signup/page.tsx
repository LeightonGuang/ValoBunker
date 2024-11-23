"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
} from "@nextui-org/react";

import { signUp } from "../actions/auth/signup/actions";

import { DiscordIcon, GoogleIcon } from "@/components/icons";

const SignupPage = () => {
  const [signUpForm, setSignUpForm] = useState<{
    username: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
  }>({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    hasEmptyUserName: false,
    hasEmptyEmail: false,
    hasInvalidEmail: false,
    hasEmptyConfirmEmail: false,
    hasInvalidConfirmEmail: false,
    hasEmptyPassword: false,
    hasEmptyConfirmPassword: false,
    hasInvalidPassword: false,
  });

  const onSignUpFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    try {
      const { data, errors, isSignUpFormValid } = await signUp(
        signUpForm.username,
        signUpForm.email,
        signUpForm.confirmEmail,
        signUpForm.password,
        signUpForm.confirmPassword,
      );

      console.log(data, errors, isSignUpFormValid);
      setErrors(errors);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(signUpForm);
  }, [signUpForm]);

  return (
    <section className="mx-auto h-full w-full lg:mx-0 lg:flex lg:items-center">
      <div className="mt-4 flex h-full w-full justify-center">
        <div className="flex items-center justify-center lg:w-1/2 lg:bg-darkBlue">
          <Card className="h-min w-80">
            <CardHeader>
              <div className="mx-auto flex w-min flex-col whitespace-nowrap text-center">
                <span className="text-2xl">Welcome to Valo Bunker!</span>
                <span className="text-sm">Create your account</span>
              </div>
            </CardHeader>
            <CardBody className="gap-4">
              <form className="flex flex-col gap-4">
                <Input
                  isRequired
                  errorMessage={
                    errors.hasEmptyUserName ? "User name is required" : ""
                  }
                  isInvalid={errors.hasEmptyUserName}
                  label="User Name"
                  name="username"
                  placeholder="username"
                  type="text"
                  onChange={onSignUpFormChange}
                />
                <Input
                  isRequired
                  errorMessage={
                    errors.hasEmptyEmail
                      ? "Email is required"
                      : errors.hasInvalidEmail
                        ? "Invalid email"
                        : ""
                  }
                  isInvalid={errors.hasEmptyEmail || errors.hasInvalidEmail}
                  label="Email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  onChange={onSignUpFormChange}
                />
                <Input
                  isRequired
                  errorMessage={
                    errors.hasEmptyConfirmEmail
                      ? "Confirm email is required"
                      : errors.hasInvalidConfirmEmail
                        ? "Emails do not match"
                        : ""
                  }
                  isInvalid={
                    errors.hasEmptyConfirmEmail || errors.hasInvalidConfirmEmail
                  }
                  label="Confirm Email"
                  name="confirmEmail"
                  placeholder="you@example.com"
                  type="email"
                  onChange={onSignUpFormChange}
                />
                <Input
                  isRequired
                  errorMessage={
                    errors.hasEmptyPassword ? "Password is required" : ""
                  }
                  isInvalid={errors.hasEmptyPassword}
                  label="Password"
                  name="password"
                  placeholder="password"
                  type="password"
                  onChange={onSignUpFormChange}
                />
                <Input
                  isRequired
                  errorMessage={
                    errors.hasEmptyConfirmPassword
                      ? "Confirm password is required"
                      : errors.hasInvalidPassword
                        ? "Passwords do not match"
                        : ""
                  }
                  isInvalid={
                    errors.hasEmptyConfirmPassword || errors.hasInvalidPassword
                  }
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="confirm password"
                  type="password"
                  onChange={onSignUpFormChange}
                />
                <Button color="primary" formAction={handleSignUp} type="submit">
                  Sign up
                </Button>
              </form>
              <Divider />
              <div className="flex w-full flex-col gap-4">
                <Button
                  className="w-full bg-white font-medium text-black light:border-1 light:border-default-500"
                  startContent={<GoogleIcon className="h-4 w-4" />}
                >
                  Sign up with Google
                </Button>
                <Button
                  className="w-full bg-blurple font-medium text-white"
                  startContent={<DiscordIcon className="h-4 w-4" />}
                >
                  Sign up with Discord
                </Button>
                <div className="text-center text-sm">
                  {`Already have an account? `}
                  <Link className="text-sm" href="/login">
                    Log in
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

export default SignupPage;
