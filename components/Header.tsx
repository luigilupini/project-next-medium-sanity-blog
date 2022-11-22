import Image from "next/image";
import Link from "next/link";
import logo from "../public/static/logo.png";
// `Link` can prefetch <a> beforehand on clients behalf:
// `next/link` caches results in the client-side and your visitor will not fetch
// a revalidated result out of the box unless there is a full-page reload.
// https://nextjs.org/docs/api-reference/next/link
export default function Header() {
  return (
    <header className="flex justify-between p-5 mx-auto max-w-7xl">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <Image
            src={logo}
            width={176}
            height={176}
            alt="logo"
            className="inline-block cursor-pointer"
          />
          {/* <span className="text-xs font-bold">plus</span> */}
        </Link>
        {/* Mobile first with the div hidden till we breakpoint into flex */}
        <div className="items-center hidden space-x-5 md:inline-flex"></div>
        <h3>Our story</h3>
        <h3>Membership</h3>
        <h3 className="px-4 py-1 text-white bg-green-600 rounded-full">
          Write
        </h3>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="px-4 py-1 border border-green-600 rounded-full">
          Get Started
        </h3>
      </div>
    </header>
  );
}
