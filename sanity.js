import {
  createImageUrlBuilder,
  createCurrentUserHook,
  createClient,
} from "next-sanity";

/* https://github.com/sanity-io/next-sanity (Usage)
It’s practical to set up dedicated files where you import and set up your client
etc. Below is a comprehensive example of the different things you can set up. */

export const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-10-21", // Learn more: https://www.sanity.io/docs/api-versioning
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: process.env.NODE_ENV === "production",
};
// SANITY HOOKS:
// Setup the client for fetching data in the `getProps` page function in sanity.
// It `sanityClient` is used to query our sanity (CMS) backend.
export const sanityClient = createClient(config);
// Set up a helper function for generating Image URLs with only asset reference
// data in your documents. Read more: https://www.sanity.io/docs/image-url
// The source used and passed in is from the client's query.
export const urlFor = (source) => createImageUrlBuilder(config).image(source);
// Helper function for using the current logged in user account.
export const useCurrentUser = createCurrentUserHook(config);
