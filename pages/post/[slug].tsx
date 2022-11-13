import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";

interface Props {
  post: Post;
}

export default function Slug({ post }: Props) {
  console.log(post);
  return (
    <main>
      <Header />
    </main>
  );
}

/* Why is (SSR) not perfect for all operations:
The problem seen with "re-rendering" in the (SSR) for each request, is that this
cache duration for the content that determines if stale, could be too short. You
can for static pages in this scenario. Which are cached but also you can combine
this with the magic of choosing how often, the page refreshing should occur. Say
refreshing of the page every 60 seconds instead. This means our cache is never
going to be stale for the period we define it as. For pages like login, or blog
post that does'nt change much "non-changing content", then (SSG) is better. 

That is how you get the best of both worlds!
https://nextjs.org/docs/basic-features/data-fetching/overview

# Incremental Static Regeneration (ISR):
Remember when a request is made to a page that was "pre-rendered" at build time,
it will initially show the cached page. Any requests to the page after a initial
request, and before 10 seconds, these are also cached & instantaneous. After the
10-second window however, the next request will still show cached, but now stale
page. Next.js triggers a "regeneration" of the page in the background.

Next.js allow you to create or update static pages after you’ve built your site.
Again, (ISR) enables static-generation on a per-page basis, where you don't need
a server to rebuild an entire page, on each page request, as the data is static.
To static page and retain benefits while scaling with ISR, add `revalidate`. 

# How to Create Dynamic Routes in Next.js:
Defining routes by using predefined paths is not always enough for complex apps.
In Next.js you can add brackets to a page ([param]) to create a dynamic route a
(url, slugs, params). Any route /post/1 or /post/abc, will be matched by a pages
folder pages/post/[file].js. The matched path parameter is then sent as a query
parameter to the page like [slug].tsx, and merged with other query parameters. A
example, route /post/abc will have a `query` object: { "slug": "abc" }. Dynamic
routes can be extended to catch all paths by adding three dots (...) inside the
brackets. A example `pages/post/[...slug].js` matches `/post/a`, and `/post/a/b`.
Client-side navigation to dynamic routes/pages are handled with `next/link`. If
we wanted to have links to the routes, use the Link component.
https://nextjs.org/learn/basics/dynamic-routes

The feature allows us to make "dynamic pages" determined by the slug/id. Dynamic
routes are `/pages/here` that allow you to use custom parameters in an URL. They
are especially beneficial when creating pages for dynamic content. This approach
is better than creating a page component for each post separately. These dynamic
routes are handled by `getStaticProps` & `getStaticPaths`. Like `getStaticPaths`
tells Next.js which route `paths` it should pre-build in advance. Then we need a
getter like function, `getStaticProps` to fetch these paths like props.

# Creating Nested Dynamic Routes in Next.js:
Our index.tsx has a Link that will send/route per post to a `/post/slug` route.
We need to define a nested route. Create a folder inside `pages` that represents
your the new dynamic route. Example [params].js, [slug].js or [id].js. For extra
info: https://www.makeuseof.com/nextjs-dynamic-routes-create/.

In the `pages` folder, create a new file like `[slug].js` then create the needed
component that takes the post data as a prop. As seen before, you have different
ways, you can pass a props to a component. The method you choose, depends on how
you want to render the page. To fetch the data during "build time", that's (SSG)
and uses `getStaticProps`. The other approach like our Home component that's now
fetching all posts on a pre-request base, when a user hits the home route. With
`getServerSideProps`, that ensures all `props` are "pre-rendered" per request. A
more suitable method for constantly changing data.

# Use getStaticProps to fetch data: 
Blog posts don’t change often, so fetching them at a "build time" is sufficient.
If you want to fetch data on every request, use the explained getServerSideProps
instead of getStaticProps. Note that approach is slower, you should only use it
when consuming regularly changing data. So above we modify the `Post` component
to include the `getStaticProps` function, seen below.

Implementation of `getStaticPaths` fetches all posts that should be rendered and
returns the `slugs`, as params object, in our mapping method below. You must use
`getStaticProps` and `getStaticPaths` together to support a dynamic route. Using
the `getStaticPaths` function generates dynamic routes/paths, meaning it informs
Next.js which paths to "pre-render" ahead of time for us. While `getStaticProps`
function then fetches this data as props, rendered at each destination page. */
export async function getStaticPaths() {
  // Here we telling Next.js which paths/routes it should "pre-prepare" for. All
  // `paths` props are fetched adjacent to a `slug.current` value from sanity.
  const query = `* [_type == 'post']{
    _id,
    slug {
      current
    }
  }`;
  // Call an external API endpoint to get posts:
  const posts = await sanityClient.fetch(query);
  // Returning the required `params` object:
  // If a page has dynamic routes/pages use `getStaticProps` and you must define
  // the paths in an array to be statically generated (pre-built). Also you will
  // need `getStaticPaths` for static site generation (SSG) pages. This `[slug]`
  // page produces dynamic routes. With [slug].tsx, Next statically pre-renders
  // all our `paths` as returned props with `getStaticPaths`. For more info see:
  // https://nextjs.org/docs/basic-features/data-fetching/get-static-paths.
  const paths = posts.map((post: Post) => {
    return {
      params: {
        slug: post.slug.current,
      },
    };
  });
  // These paths need to be provided as `array` to Next whereby each object has
  // key called `params` that holds the actual paths inside it. Because our file
  // is called `[slug].tsx`, and we get a key-value from sanity called slug, the
  // key in our returning `params` object for Next.js is called called `slug`. A
  // `fallback` of blocking shows a 404 page if it does'nt exist.
  return {
    paths,
    fallback: "blocking",
  };
}

/* You can't use getStaticPaths alone:
We have told Next.js what `paths` for routes/pages ahead of time to prepare also
known as pre-render/pre-build. getStaticPaths must be used with `getStaticProps`
Note you cannot use it with `getServerSideProps`. Here we telling Next.js how to
use that "pre-built" data that being the returned `paths` prop slug/id property.
Our getStaticPaths return value is the needed array of `paths` which in our case
is a list of all the slugs. And then for "each page" `getStaticProps` uses those
slugs to then fetch information for the dynamic page we route toward. 

# Context parameter: 
The `context` parameter is an object containing the following keys:

- `params` contains the route parameters for pages using dynamic routes.

Example if the page name is [id].jsx or in our case [slug].tsx, then a `params`
will look like { slug: ... }. As explained, use this with `getStaticPaths`.

- `preview` is true if the page is in the Preview Mode and undefined otherwise.
- `previewData` contains the preview data set by setPreviewData.
- `locale` contains the active locale (if enabled).
- `locales` contains all supported locales (if enabled).
- `defaultLocale` contains the configured default locale (if enabled).

# getStaticProps return values:
The `getStaticProps` function should return an object containing either `props`,
`redirect`, or `notFound` followed by an optional `revalidate` property.

- `props` object, where each value is received by a this page component.
- `revalidate` time property value after which a page re-generation can occur.
  > Learn more about Incremental Static Regeneration.
- `notFound` boolean allows the page to return a 404 status and 404 Page. 
- `redirect` object allows redirecting to internal or external resources.
*/
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `* [_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug,
    body
  }`;
  const post = await sanityClient.fetch(query, { slug: params?.slug });
  // Error handling if no post was found:
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    // After 60 seconds, it will update the cached version.
    // This means a 59 second visitor to this page, will get the older page.
    // # fallback: 'blocking':
    // If 'blocking', new paths not returned by `getStaticPaths` will wait for a
    // HTML to be generated, identical to (SSR) experience "hence why blocking",
    // and then future requests are cached, so it only happens once per "path".
    // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
    revalidate: 60,
  };
};
