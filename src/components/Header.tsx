"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-valorantRed px-4">
      <Link href="/">
        <h1 className="text-3xl font-bold">Valo Bunker</h1>
      </Link>
      <nav className="flex h-16 items-center">
        <Link className="hover:underline" href="/">
          Home
        </Link>
        <Link className="ml-4 hover:underline" href="/smokes">
          Smokes
        </Link>
      </nav>
    </header>
  );
};

export default Header;
