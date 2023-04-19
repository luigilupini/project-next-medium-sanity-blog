import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

import { sanityClient, urlFor } from '../sanity.js';
import { Post } from '../typings';

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
            </span>{' '}
            where good ideas find you.
          </h1>
          <h2>
            Discover stories, thinking, and expertise from writers on
            any topic.
          </h2>
        </div>
        <img
          className="hidden h-32 md:inline-flex lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt="logo"
        />
      </div>
      {/* Posts from sanity */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="overflow-hidden border rounded-lg cursor-pointer group">
              {/* If you truly want to confirm that a variable is not null & not
              an empty string specifically, you would confirm with `!`: */}
              <div className="overflow-hidden">
                <img
                  className="object-cover w-full h-48 transition-transform duration-200 ease-in-out group-hover:scale-105"
                  src={urlFor(post.mainImage).url()!}
                  alt=""
                />
              </div>
              <div className="flex justify-between p-5 bg-white ">
                <div>
                  <p className="p-1 text-lg font-bold">
                    {post.title}
                  </p>
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
/* Why wrap your React app with Next.js:
By default, Next.js pre-renders every page! This means that Next generates HTML
for each page in advance, instead of having it all done by your client-side JS.
Pre-rendering, can result in better performance and SEO. Each generated HTML is
associated with minimal JS code necessary for that `pages/page`. When a page is
loaded by the browser, its JS code runs and makes the page fully interactive.
(This process is called hydration.) Plain React does not pre-render.

# Two Forms of Pre-rendering:
The difference is in when it generates the HTML for a page. Static Generation is
the pre-rendering method that generates the HTML at build time. The pre-rendered
HTML is then reused on each request. Server-side rendering is the pre-rendering
method that generates the HTML on each request (slower).

In development mode (when you run `npm run dev`), your pages are pre-rendered on
every request. This also applies to (SSG) Static Generation to make it easier to
develop. When going to production, Static Generation will happen once at a build
time, and not on every request.

Importantly, Next.js lets you choose which pre-rendering to use for each page.
You can create a "hybrid" Next.js app by using Static Generation for most pages
and using Server-side Rendering for others.

You should ask yourself: "Can I pre-render this page ahead of a user's request?"
If the answer is yes :), then you can choose Static Generation. However (SSG) is
not a good idea if you cannot pre-render a page ahead of a user request. Maybe a
page shows frequently updated data, a page content changes on every request. You
could use Server-side Rendering. It will be slower, but a pre-rendered page will
always be up-to-date. Or skip pre-rendering and client-side populate frequently
updated data. https://nextjs.org/learn/basics/data-fetching/pre-rendering

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
explained if a client requests `/posts` the Next hosted server will "pre-render"
per request when using (SSR). Affectively building the page `/post` for Post.tsx
on the server and then delivers that "built" page component to the client. 

The helper function you require is called:
https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props

Function export a `getServerSideProps` for the needed (SSR) operation, from the
page component file. Now as explained, Next will "pre-render" this page on each
request using the data returned by `getServerSideProps`.

Note that irrespective of rendering type, any `props` will be passed to the page
component anyway, and can be viewed on the client-side as usual, in your initial
HTML. This is to allow the page to be "hydrated" correctly. Make sure you don't
pass any sensitive info that shouldn't be available on the client `props`. Here
the server pre-builds the page, as it runs each client request. This changes the
routed page, into our server-side rendered (SSR) page.

The `getServerSideProps` only runs on server-side, never runs on the browser. If
a page uses or has the `getServerSideProps` helper function, then: When a client
requests this page/route directly, then the function runs as mentioned again. A
request means the page is "pre-rendered" by the server, with returned props.

On the client-side, through next/link or next/router component, our Next sends a
API request to the server, which runs the `getServerSideProps`.

Note, `getServerSideProps` can only be exported from a page, not non-page files.
You must export `getServerSideProps` as a standalone function — it will not work
if you add it as a property of this page component. The `getServerSideProps` API
reference covers all parameters & `props` that can be used:
https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props */
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
  /* getServerSideProps `return` values:
  The function should return an object with any one of the following properties:
  `props`: an object is a key-value pair. `getServerSideProps` return JSON which
  will be used to render the page. In that case, each prop value that's received
  by this page component, needs the JSON data serializable into a JS object so
  that it can be useable in the JavaScript world. */
  return {
    // will be passed to the page component as props
    props: { posts },
  };
}
/* # Benefits of Using Next.js
https://www.makeuseof.com/next-js-why-migrate/

- Shallow Learning Curve
Next.js is a React wrapper which means it extends React code syntax. Developers
can therefore pick it up quite easily. And like React, Next has create-next-app
a command that you can execute to scaffold a new Next app quickly.

`npx create-next-app your-next-app-name`

- Pre-Rendering
JS frameworks like React, Vue popularized client-side rendering (CSR). This is a
rendering method where the server sends a HTML shell and a bundle.js. That code
then runs in the browser, updating HTML document in a process called "hydration"
But since rendering happens on the user's device (CSR) applications can be slow.
Next.js provides a solution through "pre-rendering". Instead of building the UI
on the client-side (CSR), Next.js builds it in advance on the server.

There are two types of pre-rendering:

* 1) Server-side rendering (SSR)
In SSR the server builds the HTML, fetches all dynamic content and then sends it
to the browser. The server does this for every incoming request. SSR, therefore,
best used for constantly changing data. But SSR pages can be slower depending on
the amount of data the application needs to fetch from the server and the server
performance level. Through `getServerSideProps` in Next.js, you can use SSR only
for pages within your `pages` folder, that need it.

* 2) Static Site Generation (SSG)
With SSG, the app prefetches all data during build. It then generates all HTML
pages and serves them for multiple requests. It’s very fast because, once server
has generated all the pages, a CDN can be used to cache and serve them. Because
of this, (SSG) is perfect for "static pages" like landing pages, blog posts. For
static pages consuming data from APIs, Next allows you to fetch the data during
build time using `getStaticProps`.

Both rendering methods have advantages! Depending on use cases, Next allows you
to mix/match them on a page-to-page basis.

- Built-In Routing
Next.js uses a file-based routing system. The server automatically converts all
the files saved in the `pages` folder to routes. This is unlike React that does
require installing libraries like React Router. Furthermore React supports (CSR)
client-side routing through the <Link/> component. It also prefetches the pages
whose links are in the viewport. This is only for pages using (SSG), but even so
this feature makes navigating from one page to another, seem very fast.


- Automatic Code Splitting
Code splitting refers to dividing the bundle files into chunks that you can lazy
load on demand. Next automatically handles code splitting. Next.js automatically
splits each file in the `pages` folder in its own bundle. Additionally, any code
shared between the pages is bundled in one to prevent downloading the same code.
Code splitting reduces initial load time, since the browser has to download only
a small amount of data.

- Built-In Image Optimization
Heavy images can slow down your site and lower its Google rankings. With Next.js
you can use the image component to optimize images automatically.

`import Image from 'next/image'`

This component serves correctly sized images and modern formats like webp if the
browser supports it. `Images` are also loaded only when a user scrolls them into
view. This optimizes the page speed and saves space on the user's device.

- Built-In CSS Support
Next supports CSS modules and Sass out of the box. You don't need to spend extra
time configuring it and can go straight to writing CSS styles. Next also comes
with styled-jsx which allows you to write CSS directly inside your component.


- Growing Community
Since Next is built on React, it is gaining popularity quite fast. Therefore, a
growing community of developers willing to help if you get stuck. This, combined
with excellent documentation, ensures that even beginners can easily get started
with Next.js.

- When Should You Use Next.js?
One of the best things about Next.js is its rendering options. You are not tied
to CSR, SSR, or SSG and can choose which pages you want rendered on server-side,
client-side or which ones you want to be entirely static.

Because of this you can customize how each page in your app renders based on its
needs. For instance, you can render pages that rely on constantly changing data
using SSR, and render a other static pages like a login or blog post using SSG.

Next comes with many built-in features and extra configuration that allows you
to start adding features right away. You don't need to worry about configuring
your app’s routes, optimizing images, or splitting bundle files. It's all done.

If you want to create React applications that consume dynamic content and don’t
want to spend time installing packages, or configuring your ap to be fast, Next
is great. However, creating a static single-page app, plain React is fine. */
