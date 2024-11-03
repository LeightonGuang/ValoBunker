"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-valorantRed px-4">
      <h1 className="bg-valorantRed text-3xl font-bold">Valo Bunker</h1>
      <nav className="flex h-16 items-center bg-valorantRed">
        <Link className="bg-valorantRed" href="/">
          Home
        </Link>
        <Link className="ml-4 bg-valorantRed" href="/smokes">
          Smokes
        </Link>
      </nav>
    </header>
  );
};

export default Header;
