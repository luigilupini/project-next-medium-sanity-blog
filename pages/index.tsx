import Head from "next/head";
import Header from "../components/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Medium+</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      <Header />
    </div>
  );
}
