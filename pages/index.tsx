import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";

import { sanityClient, urlFor } from "../sanity.js";
import { Post } from "../typings";

// ! TypeScript: We require structure 🤞
// Here define what our props "interface or types" should look like.
// We don't just want anything passed here :)
interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
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
      {/* Posts from sanity */}
      <div className="grid grid-cols-1 gap-3 p2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="overflow-hidden border rounded-lg cursor-pointer group">
              {/* If you truly want to confirm that a variable is not null & not
              an empty string specifically, you would confirm with `!`: */}
              <div className="overflow-hidden">
                <img
                  className="object-cover w-full transition-transform duration-200 ease-in-out h-60 group-hover:scale-105"
                  src={urlFor(post.mainImage).url()!}
                  alt=""
                />
              </div>
              <div className="flex justify-between p-5 bg-white ">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="object-cover w-12 h-12 m-1 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
/* Why Next.js in front of your React build?:
From the Home page we perform a server-side render (SSR). Any visit to this page
its going to pre-render per the request. In client only rendering the bundle can
get quite large. In analogy, Next has provided a middle "server" like service. A
user does not get the large bundle.js from just a React service, because what is
in front of our React build is Next, that instead gives a page/split. An example
the /posts url would return the `pages/Posts` component, that is a much smaller
file split from the bundle.js that the client gets returned.

# Before Next was around our SPA's was mainly client-side only: 
Different ways in which page components in Next, get rendered. The static render
is when we don't use any server-side "function". Pages are only pre-built on the
applications build time so when you `run npm build`, & deploy the site all pages
get pre-built and serves mostly client-side render (CSR), by the client browser.
That's a typical React only build where the client handles all the work. Example
a client fetching task would need condition or loaders 🤬.

# Using the benefits of server-side render (SSR):
A faster approach is as explained Why Next.js, with server-side render (SSR). As
explained if a client requests `/posts` the Next.js hosted server will "render",
per request when using (SSR). Affectively building the page (`/posts`) for Posts
on the server and then delivers that "built" page component to the client. 

The helper function you require is called:
https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props

Function export a `getServerSideProps` for the needed (SSR) operation, from the
page component file. Now as explained, Next will "pre-render" this page on each
request using the data returned by `getServerSideProps`.

Note that irrespective of rendering type, any `props` will be passed to the page
component anyway, and can be viewed on the client-side as usual, in your initial
HTML. This is to allow the page to be "hydrated" correctly. Make sure you don't
pass any sensitive info that shouldn't be available on the client in `props`.

This is where the server pre-builds the page, so as it runs each client request.
This changes the route/link, into our server-side rendered (SSR) page.

`getServerSideProps` only runs on server-side and never runs on the browser. If
a page uses or has the `getServerSideProps` helper function, then: When a client
request's this page/route directly, then the function runs as mentioned again at
request time on our server, the page is "pre-rendered" with returned props.

When you request this page on client-side, through next/link or next/router, our
Next.js sends an API request to the server, which runs `getServerSideProps`. And
`getServerSideProps` can only be exported from a `page`, not non-page files.

You must export `getServerSideProps` as a standalone function — it will not work
if you add it as a property of this page component. The `getServerSideProps` API
reference covers all parameters & `props` that can be used:
https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
*/
export async function getServerSideProps() {
  // Define a query that fetches asynchronously from the sanity backend service.
  const query = `* [_type == 'post']{
    _id,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }
  `;
  /* How do we get this server-side rendered data back into the component? Well
  it all works via `props` inside of React. This means you can write server-side
  code directly in `getServerSideProps`, like fetching data from a backends. */
  const posts = await sanityClient.fetch(query);
  // console.log(posts);
  /* getServerSideProps `return` values:
  The function should return an object with any one of the following properties:
  
  - `props`: an object is a key-value pair.
  
  `getServerSideProps` returns JSON which will be used to render the page. So in
  that case, each prop value that is received by this page component, needs the
  JSON data serializable into a JS object so that it can be useable. */
  return {
    // will be passed to the page component as props
    props: { posts },
  };
}
