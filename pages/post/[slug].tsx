import { useState } from "react";
import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";

/* https://react-hook-form.com/:
`useForm` is a custom hook for managing forms with ease. The hook takes a object
and options object that allows you to configure the validation strategy before a
user submits the form (onSubmit event). Validations trigger on the submit event
being onSubmit. Invalid attach onChange event listeners to re-validate them.*/
import { useForm, SubmitHandler } from "react-hook-form";

/* https://www.sanity.io/plugins/react-portable-text:
React Portable Text uses @sanity/block-content-to-react under the hood, but maps
each of these types to the correct place in the serializers for you, normalizing
`props` to match the fields supplied by users in your Sanity Studio, simplifying
the cognitive load required to author new ones. */
import PortableText from "react-portable-text";

// This is responsible for converting objects into understandable JS data types.
const serializer = {
  h1: (props: any) => <h1 className="my-5 text-2xl font-bold" {...props} />,
  h2: (props: any) => <h2 className="my-5 text-xl font-bold" {...props} />,
  li: ({ children }: any) => <li className="ml-4 list-disc">{children}</li>,
  link: ({ href, children }: any) => (
    <a href={href} className="text-blue-500 hover:underline">
      {children}
    </a>
  ),
};

interface FormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

export default function Slug({ post }: Props) {
  console.log(post);
  const [submitted, setSubmitted] = useState(false);
  /* # Register uncontrolled/controlled inputs:
  We can destruct the `register` method that allows you to register an input or
  select element and apply validation rules to (React Hook Form). The validation
  rules are all based on the HTML standards, and also allow for custom options.

  # Ready to send to the server:
  `handleSubmit` callback/function receives form data if validations successful.
  The `handleSubmit` function will not swallow errors that occurred inside your
  onSubmit events, recommend try and catch inside async requests for errors.
  
  Below our form knows we can only have the above types specified by a interface
  as a sort of "template" for the types our useForm hook requires. */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();
  // List of exported Typescript [Types](https://react-hook-form.com/ts).
  // We point to our `FormInput` type so the data is referring to our types.
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />
      <img
        className="object-cover w-full h-40"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl p-5 mx-auto">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="object-cover w-10 h-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{" "}
            <span className="font-medium text-green-600">
              {post.author.name}
            </span>{" "}
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        {/* Importing data from the post body in sanity: */}
        <div className="mt-10">
          {/* React Portable Text maps the following types explicitly and treats
          all other properties of a `serializers` object as custom types. These
          custom types are used for both type and block blocks (i.e custom marks
          as well as custom block-level insertion types). Simply, `serializers`
          are essentially detail on what to do with an item "across an array of
          objects" in our rich text array of objects. They are responsible for a
          converting of objects into data type understandable by javascript */}
          <PortableText
            content={post.body}
            serializers={serializer}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
          />
        </div>
      </article>

      <hr className="max-w-lg mx-auto my-5 border border-custom-yellow-medium" />

      {submitted ? (
        <div className="flex flex-col max-w-2xl p-10 mx-auto text-white bg-yellow-500">
          <h3 className="text-3xl font-bold">Thank you for your feedback!</h3>
          <p>Once it has been approved, it will appear below.</p>
        </div>
      ) : (
        // Form:
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-2xl p-5 mx-auto mb-10"
        >
          <h3 className="text-sm">Enjoy this article?</h3>
          <h4 className="text-2xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          {/* This hidden `_id` form embeds information inside it. Here we use the
        register function returned from `useForm` to spread out its values into
        our form, enhancing all input fields we place it as a prop. The types we
        pass to the register callbacks, are setup in `FormInput` interface. */}
          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-yellow-500 focus:ring"
              type="text"
              placeholder="Gareth Mallory"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-yellow-500 focus:ring"
              type="text"
              placeholder="Gareth Mallory"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-textarea ring-yellow-500 focus:ring"
              rows={8}
              placeholder="Gareth Mallory"
            />
          </label>

          {/* errors will be returned here when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- A name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">- A email field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - A comment field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="px-4 py-2 font-bold text-white rounded shadow cursor-pointer bg-custom-yellow-medium hover:bg-yellow-400 focus:outline-none focus:shadow-outline"
          />
        </form>
      )}
      <hr className="max-w-lg mx-auto my-5 border border-custom-yellow-medium" />

      {/* Comments */}
      <div className="flex flex-col max-w-2xl p-10 mx-auto my-10 space-y-2 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-custom-yellow-medium">{comment.name}</span>:{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
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
    'comments': *[
      _type == 'comment' &&
      post._ref == ^._id &&
      approved == true
    ],
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
