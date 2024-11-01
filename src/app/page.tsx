import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        <div
          className="m-4 w-32 rounded-sm border-[1px] border-valorantRed p-4"
          id="content"
        >
          <h2>Content</h2>
          <ul className="list-disc">
            <li className="ml-4">
              <Link className="hover:underline" href="/smokes">
                Smoke Abilities
              </Link>
            </li>
            <li className="ml-4">
              <Link href={"/blind"}>Blind Abilities</Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
