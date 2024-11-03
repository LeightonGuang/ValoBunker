import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="mx-4 flex justify-center py-4" id="home-container">
        <div
          className="flex w-[60rem] flex-col sm:min-w-40 sm:flex-row"
          id="home-container-layout"
        >
          <div
            className="order-2 w-full rounded-sm border-[1px] border-valorantRed p-2 sm:order-1 sm:max-w-max"
            id="left-content"
          >
            <h2>Content</h2>
            <ul className="list-disc">
              <li>
                <Link className="hover:underline" href="/smokes">
                  Smoke Abilities
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href={"/blind"}>
                  Blind Abilities
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/weapons">
                  Weapons
                </Link>
              </li>
            </ul>
          </div>
          <div
            className="order-1 w-full rounded-sm border-[1px] border-valorantRed p-2 sm:order-2"
            id="main-content"
          >
            <div>
              <h2>Newest Update</h2>
              <div>
                <ul className="list-disc">
                  <li>
                    <div className="flex justify-between">
                      <span>Patch 9.08</span>
                      <span>22/10/2023</span>
                    </div>
                    <Image
                      className="w-full p-[-1rem]"
                      src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/d43169a6840240ec5d9fef1a5d35e7db4ee40009-1920x1080.jpg"
                      alt="update image"
                      width={64}
                      height={64}
                      unoptimized
                    />
                    <p className="mt-2">
                      Updates to Yoru’s Fakeout, Gekko’s abilities, and Sunset.
                      New: TDM map Glitch.
                    </p>
                    <a
                      className="font-bold text-valorantRed"
                      href="https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-9-08/"
                      target="_blank"
                    >
                      Link
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="order-3 w-full border-[1px] border-valorantRed p-2 sm:w-80"
            id="right-content"
          >
            <h2>Esports</h2>
            <ul className="mt-2">
              <li className="flex items-center justify-between rounded-md bg-black p-2">
                <div className="flex gap-4">
                  <p>SEN City Classic</p>
                  <p>Nov 1 - 3, 2024</p>
                </div>
                <Image
                  className="h-12 w-12"
                  src="https://owcdn.net/img/672158045f9f1.png"
                  alt="sen city classic logo"
                  width={32}
                  height={32}
                  unoptimized
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
