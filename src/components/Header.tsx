"use client";

import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

const Header = () => {
  return (
    <Navbar
      className="bg-valorantRed p-4 text-white"
      shouldHideOnScroll={true}
      id="header"
    >
      <NavbarBrand>
        <Link className="hover:underline" href="/">
          <h1 className="text-3xl font-bold">Valo Bunker</h1>
        </Link>
      </NavbarBrand>
      <NavbarContent className="">
        <NavbarItem>
          <Link href="/">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/smokes">Smokes</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
