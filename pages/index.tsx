import Head from "next/head";
import Header from "../components/Header";
/* Custom fonts in Next.js + Tailwind: 
https://dev.to/manuelalferez/custom-fonts-in-nextjs-tailwindcss-2iip

https://tailwindcss.com/docs/customizing-colors:
Found the color here: https://medium.com/ */
export default function Home() {
  return (
    <div className="m-auto max-w-7xl">
      <Head>
        <title>Medium+</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      <Header />
      <div className="flex items-center justify-between py-10 border-black border-y lg:py-0 bg-custom-yellow-medium">
        <div className="px-10 space-y-5">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{" "}
            where good ideas find you.
          </h1>
          <h2>
            Discover stories, thinking, and expertise from writers on any topic.
          </h2>
        </div>
        <img
          className="hidden h-32 md:inline-flex lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt="logo"
        />
      </div>
    </div>
  );
}
