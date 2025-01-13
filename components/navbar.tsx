"use client";

import {
  NavbarMenu,
  NavbarItem,
  NavbarBrand,
  NavbarContent,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import clsx from "clsx";
import NextLink from "next/link";
import { useState } from "react";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { link as linkStyles } from "@nextui-org/theme";

import {
  MenuIcon,
  CloseIcon,
  SearchIcon,
  ChevronDown,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { useUser } from "@/app/hook/useUser";
import { logOut } from "@/app/actions/auth/logout/actions";

export const Navbar = () => {
  const router = useRouter();
  const { user, isLoadingUser } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="pointer-events-none flex-shrink-0 text-base text-default-400" />
      }
      type="search"
    />
  );

  const handleLogOut = async () => {
    try {
      const { error } = await logOut();

      if (error) {
        console.error(error);
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NextUINavbar
      className="bg-valorantRed"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <p className="text-inherit text-large font-bold">Valo Bunker</p>
          </NextLink>
        </NavbarBrand>
        <div className="ml-2 hidden justify-start gap-4 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "h-full data-[active=true]:font-medium data-[active=true]:text-primary",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 text-medium text-foreground data-[active=true]:text-primary"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                  radius="sm"
                  variant="light"
                >
                  Similar Abilities
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Similar Abilities"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              {siteConfig.navAbilitiesComparison.map((abilityType, i) => (
                <DropdownItem
                  key={i}
                  description={abilityType.description}
                  href={abilityType.href}
                  onPress={() => {
                    setIsMenuOpen(false);
                    router.push(abilityType.href);
                  }}
                >
                  {abilityType.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 text-medium text-foreground data-[active=true]:text-primary"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                  radius="sm"
                  variant="light"
                >
                  Esports
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Esports"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              {siteConfig.dropdownEsports.map((esport) => (
                <DropdownItem
                  key={esport.label}
                  description={esport.description}
                  href={esport.href}
                  onPress={() => {
                    setIsMenuOpen(false);
                    router.push(esport.href);
                  }}
                >
                  {esport.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle
          className="lg:hidden"
          icon={isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        />

        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}

        <NavbarItem className="hidden lg:block">
          {isLoadingUser ? (
            ""
          ) : user?.user_metadata ? (
            <Dropdown>
              <DropdownTrigger className="hover:cursor-pointer hover:underline">
                {user.user_metadata.name || "No Username"}
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Account"
                disabledKeys={[user.user_metadata.name]}
              >
                <DropdownSection showDivider aria-label="Profile">
                  <DropdownItem key={user.user_metadata.name}>
                    {`Logged in as @${user.user_metadata.name}`}
                  </DropdownItem>

                  <DropdownItem
                    key="settings"
                    href="/settings"
                    onPress={() => router.push("/settings")}
                  >
                    Settings
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection showDivider aria-label="Moderator">
                  <DropdownItem
                    key="moderator"
                    href="/moderator/manage/agents"
                    onPress={() => {
                      router.push("/moderator/manage/agents");
                      setIsMenuOpen(false);
                    }}
                  >
                    Moderator
                  </DropdownItem>
                </DropdownSection>

                <DropdownItem key="logout" onPress={handleLogOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex gap-4">
              <Button as={Link} href="/login" variant="flat">
                Log in
              </Button>
              <Button as={Link} href="/signup" variant="flat">
                Sign Up
              </Button>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={"foreground"}
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="h-7 p-0 text-[1.125rem] leading-none data-[active=true]:text-primary"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                  radius="sm"
                  variant="light"
                >
                  Similar Abilities
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Similar Abilities"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              {siteConfig.navAbilitiesComparison.map((abilityType, i) => (
                <DropdownItem
                  key={i}
                  description={abilityType.description}
                  href={abilityType.href}
                  onPress={() => {
                    setIsMenuOpen(false);
                    router.push(abilityType.href);
                  }}
                >
                  {abilityType.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="h-7 w-full justify-start p-0 text-left text-[1.125rem] data-[active=true]:text-primary"
                  endContent={<ChevronDown fill="currentColor" size={16} />}
                  radius="sm"
                  variant="light"
                >
                  Esports
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Esports"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              {siteConfig.dropdownEsports.map((esport) => (
                <DropdownItem
                  key={esport.label}
                  description={esport.description}
                  href={esport.href}
                  onPress={() => {
                    setIsMenuOpen(false);
                    router.push(esport.href);
                  }}
                >
                  {esport.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {isLoadingUser ? (
            ""
          ) : user?.user_metadata ? (
            <>
              <NavbarMenuItem>
                <Divider />
                <Link
                  color={"foreground"}
                  href="/moderator/manage/agents"
                  onPress={() => {
                    router.push("/moderator/manage/agents");
                    setIsMenuOpen(false);
                  }}
                >
                  Moderator
                </Link>
              </NavbarMenuItem>

              <Divider />

              <NavbarMenuItem>
                <Link
                  color={"foreground"}
                  href="/settings"
                  onPress={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                {`@${user.user_metadata.name}` || "No Username"}
              </NavbarMenuItem>
            </>
          ) : (
            <>
              <NavbarMenuItem>
                <Link
                  className="w-full"
                  href="/login"
                  size="lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <Link
                  className="w-full"
                  href="/signup"
                  size="lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
